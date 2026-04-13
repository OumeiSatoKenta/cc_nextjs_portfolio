# 設計: CI/CD デプロイパイプライン（GitHub Actions → S3 → CloudFront）

## アーキテクチャ全体像

```
┌──────────────────────────────┐      ┌──────────────────────────────┐
│  PR（feature ブランチ）       │      │  main ブランチへの push       │
└──────────────┬───────────────┘      └──────────────┬───────────────┘
               │                                     │
        trigger                                trigger
               │                                     │
┌──────────────▼───────────────┐      ┌──────────────▼───────────────┐
│ .github/workflows/ci.yml     │      │ .github/workflows/deploy.yml │
│                              │      │                              │
│ 1. checkout                  │      │ 1. checkout                  │
│ 2. setup-node@v4 (cache npm) │      │ 2. setup-node@v4 (cache npm) │
│ 3. npm ci                    │      │ 3. npm ci                    │
│ 4. npm run lint              │      │ 4. npm run lint              │
│ 5. npm run type-check        │      │ 5. npm run type-check        │
│ 6. npm test                  │      │ 6. npm test                  │
│ 7. npm audit --audit=critical│      │ 7. npm audit --audit=critical│
│ 8. npm run build             │      │ 8. npm run build             │
│ 9. artifact の存在検証        │      │ 9. configure-aws-credentials │
│                              │      │    (OIDC AssumeRole)         │
│                              │      │ 10. aws s3 sync --delete     │
│                              │      │ 11. aws cloudfront           │
│                              │      │     create-invalidation /*   │
└──────────────────────────────┘      └──────────────────────────────┘
```

## 方針

### 設計原則

1. **品質ゲートとデプロイを分離**: PR では `ci.yml`、main push では `deploy.yml`。両者で同じ品質ゲートを再実行（信頼できる基準を 1 度きりにしない）
2. **OIDC 専用**: 静的クレデンシャルを一切持ち込まない
3. **最小権限**: ワークフローレベルの `permissions:` を必要最小限に絞り込む
4. **環境値は Secrets 経由**: Role ARN / バケット名 / ディストリビューション ID は GitHub リポジトリ Secrets、値のハードコードを禁止
5. **失敗時は即停止**: `--delete` を伴う sync が部分実行で止まらないよう、前段の品質ゲートが全部通ってから AWS 操作に進む

### 代替案と不採用理由

| 代替案 | 不採用理由 |
|--------|-----------|
| `ci.yml` と `deploy.yml` の統合（`if: github.ref == 'refs/heads/main'` で分岐） | 責務分離が曖昧になり、PR でも `permissions: id-token: write` が誤って広がるリスク。YAML の複雑化 |
| `concurrency:` で main のデプロイを直列化 | MVP 範囲外。main の push 頻度が低いので現状不要 |
| `pull_request` だけでなく `push` でも `ci.yml` を実行 | main 以外のブランチも PR 経由で CI が走る前提。push 単独のトリガーは冗長 |
| GitHub Environment（`production`）経由の承認ゲート | 個人ポートフォリオの main 自動デプロイが要件。承認ゲートは過剰 |
| Reusable Workflow で `ci.yml` を `deploy.yml` から呼び出す | YAML 行数削減はできるが、MVP では見通しの良さを優先して直書きする |
| `S3_BUCKET_NAME` をインラインハードコード | アカウントが変わると再利用不能。Secrets 経由で抽象化 |

## ワークフロー詳細

### ファイル構成

```
.github/
└── workflows/
    ├── ci.yml       # PR 品質ゲート
    └── deploy.yml   # main push デプロイ
```

### ci.yml（PR 品質ゲート）

#### トリガー

```yaml
on:
  pull_request:
    branches: [main]
```

- PR の `opened` / `synchronize` / `reopened` で起動
- 対象は main をベースとする PR のみ

#### 権限

```yaml
permissions:
  contents: read
```

OIDC トークンは不要（AWS を触らない）。`contents: read` のみ。

#### ジョブ構成

単一ジョブ `verify`:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true  # 同一 PR の古いランはキャンセル

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          persist-credentials: false
      - uses: actions/setup-node@v6
        with:
          node-version: '24'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test
      - run: npm audit --audit-level=critical
      - run: npm run build
      - name: Verify Static Export output
        run: |
          set -e
          test -d out
          test -d out/_next
          test -f out/404.html
          for page in index about/index projects/index blog/index contact/index; do
            test -f "out/${page}.html" || { echo "Missing: out/${page}.html"; exit 1; }
          done
```

#### 設計ポイント

- Node.js v24（`docs/architecture.md` に合わせる）
- `actions/setup-node@v4` の `cache: 'npm'` で `node_modules` 復元を高速化
- `npm audit --audit-level=critical` の終了コードは critical 脆弱性がなければ 0（`requirements.md` US-3 の audit-level 根拠を参照）
- 最後の `out/` 検証ステップで Static Export の出力を確認（F7 受け入れ条件を CI で満たす）

### deploy.yml（main push デプロイ）

#### トリガー

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch: {}  # 手動リトライ用（main の HEAD で再実行）
```

- 自動: main への push 時
- 手動: UI から `workflow_dispatch` で main HEAD に対して再実行可能
- **注**: `workflow_dispatch` は `inputs.ref` を持たないため、過去コミット SHA を指定したデプロイはサポートしない。ロールバックは revert コミット方式で行う（§ロールバック戦略参照）

#### 権限

```yaml
permissions:
  id-token: write   # OIDC token 発行
  contents: read    # checkout のため
```

#### ジョブ構成

単一ジョブ `deploy`（品質ゲート → ビルド → AWS デプロイ）:

```yaml
concurrency:
  group: ${{ github.workflow }}-production
  cancel-in-progress: false  # 先行デプロイを待つ（--delete との競合を防止）

jobs:
  deploy:
    if: github.ref == 'refs/heads/main'  # workflow_dispatch でも非 main ブランチ実行を無害化
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
        with:
          persist-credentials: false
      - uses: actions/setup-node@v6
        with:
          node-version: '24'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test
      - run: npm audit --audit-level=critical
      - run: npm run build
      - name: Verify Static Export output
        run: |
          set -e
          test -d out
          test -d out/_next
          test -f out/404.html
          for page in index about/index projects/index blog/index contact/index; do
            test -f "out/${page}.html" || { echo "Missing: out/${page}.html"; exit 1; }
          done
      - uses: aws-actions/configure-aws-credentials@v5
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          aws-region: ${{ vars.AWS_REGION }}
      - name: Sync to S3
        env:
          S3_BUCKET_NAME: ${{ secrets.S3_BUCKET_NAME }}
        run: aws s3 sync out/ "s3://${S3_BUCKET_NAME}/" --delete
      - name: Invalidate CloudFront
        env:
          CLOUDFRONT_DISTRIBUTION_ID: ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }}
        run: aws cloudfront create-invalidation --distribution-id "${CLOUDFRONT_DISTRIBUTION_ID}" --paths '/*'
```

#### 設計ポイント

- `timeout-minutes: 15` でハング時の暴走を防ぐ
- `if: github.ref == 'refs/heads/main'` で `workflow_dispatch` の UI 誤操作による非 main ブランチデプロイを構造的に防止
- `actions/checkout@v4` の `persist-credentials: false` で、後続ステップ（`npm ci` 等）に `GITHUB_TOKEN` を持ち回さない（サプライチェーン攻撃面の縮小）
- Secrets は `env:` 経由で環境変数化してからシェルに渡す（`"s3://${S3_BUCKET_NAME}/"`）。`${{ secrets.* }}` の直接展開はシェルインジェクション耐性がないため避ける
- `configure-aws-credentials@v5`（現在の最新安定版 v5.0.0）
- `aws s3 sync --delete` で `out/` に存在しないファイルを削除（古いデプロイの残骸を排除）。非アトミックな点は「デプロイ中の一時的不整合は許容、致命時は revert で復旧」という MVP の判断
- `cloudfront create-invalidation --paths '/*'` で全キャッシュを無効化
- 失敗時は bash のデフォルトで即中断（半端なデプロイが残らない）

## GitHub Secrets / Variables 設計

### Secrets（機密値: `${{ secrets.* }}` で参照）

| Secret 名 | 値の例 | 入手元 |
|----------|--------|--------|
| `AWS_ROLE_ARN` | `arn:aws:iam::123456789012:role/portfolio-github-actions` | `cc_aws_portfolio` の `terraform output iam_role_arn` |
| `S3_BUCKET_NAME` | `portfolio-site-123456789012` | `terraform output s3_bucket_name` |
| `CLOUDFRONT_DISTRIBUTION_ID` | `E1234ABCDEF` | `terraform output cloudfront_distribution_id` |

### Variables（非機密値: `${{ vars.* }}` で参照）

| Variable 名 | 値 | 根拠 |
|------------|-----|------|
| `AWS_REGION` | `ap-northeast-1` | 固定値。Secrets に入れるとログで `***` にマスクされデバッグが困難。意味論的にも設定値であり機密ではない |

いずれも **Repository レベル**で登録（Settings → Secrets and variables → Actions → Secrets タブ / Variables タブ）。Environment Secrets / 承認ゲートは MVP 範囲外。

## 前提条件の整合性

### インフラ側 `cc_aws_portfolio/terraform/terraform.tfvars` の修正が必要

現状:
```
github_repo = "cc_aws_portfolio"
```

必要な修正:
```
github_repo = "cc_nextjs_portfolio"
```

これが入っていないと、Trust Policy の `sub` 条件 `repo:${org}/${repo}:ref:refs/heads/main` がマッチせず、`AssumeRoleWithWebIdentity` が `AccessDenied` で失敗する。

**この修正は `cc_aws_portfolio` リポジトリ側で `terraform apply` を伴うため、本ステアリング（cc_nextjs_portfolio 側）ではドキュメント化のみ行い、実際の修正はユーザーに委ねる。**

## エラーハンドリング方針

| エラー | 検出方法 | ユーザーへのフィードバック |
|-------|---------|----------------------|
| lint / type-check / test 失敗 | ステップの exit code | ジョブ失敗、PR の status check に `failure` |
| `npm audit` で critical 脆弱性検出 | `--audit-level=critical` の exit code | ジョブ失敗。package-lock.json の更新または `npm audit fix` を実施 |
| OIDC AssumeRole 失敗（Trust Policy mismatch） | `configure-aws-credentials` がエラー終了 | ログに `Not authorized to perform sts:AssumeRoleWithWebIdentity`。`terraform.tfvars` の `github_repo` を確認 |
| S3 sync 権限不足 | `aws s3 sync` がエラー終了 | ログに `AccessDenied`。IAM ポリシーと S3 バケット名を確認 |
| CloudFront invalidation 権限不足 | `aws cloudfront create-invalidation` がエラー終了 | ログに `AccessDenied`。IAM ポリシーの Distribution ARN を確認 |

## テスト戦略

ワークフロー自体へのユニットテストは書かない。以下で検証する:

1. **シンタックス検証**: GitHub 上で実行時に YAML パースが成功すること（`actionlint` のローカル実行は任意）
2. **ドライラン的検証**: フィーチャーブランチに push して PR を開き、`ci.yml` が想定どおり起動・成功することを確認（実行環境依存のため本タスクのスコープ外。ドキュメント化して引き継ぐ）
3. **デプロイ検証**: main への初回 push で `deploy.yml` が成功し、本番 URL に反映されることを確認（本タスクのスコープ外。前提条件整備後にユーザーが実施）

## ロールバック戦略

- **コード起因**: 問題コミットを revert → main へ push → `deploy.yml` で自動再デプロイ
- **デプロイ一時障害**: `workflow_dispatch` で main HEAD をそのまま再実行（ネットワーク一時エラー・transient failure を想定）
- **インフラ起因**: `cc_aws_portfolio` 側の Terraform で対応

MVP 範囲では「問題が起きたら revert + 再デプロイ」の単純戦略を採用。過去コミット SHA を指定しての直接デプロイ（`workflow_dispatch` の `inputs.ref` 方式）は Post-MVP 扱いとする。履歴の追跡性（「main が常にデプロイ済みコード」という不変条件）を守る方が重要と判断。

## 将来拡張（Post-MVP）

| 改善案 | 優先度 | 備考 |
|-------|--------|------|
| Lighthouse CI を `ci.yml` に組み込み（Performance/Accessibility スコア 90 以上を検証） | 高 | PRD の非機能要件を CI で強制できる |
| `concurrency: group: deploy-${{ github.ref }}` でデプロイの直列化 | 中 | main への連続 push 時の競合防止 |
| E2E テスト（Playwright）の追加 | 中 | 静的サイトのため優先度は低め |
| デプロイ成功 / 失敗の Slack 通知 | 低 | 個人運用では不要 |
| 依存関係の自動更新（Dependabot / Renovate） | 中 | 別チケットで導入 |
| Staging 環境（S3 バケット別 + CloudFront 別）とプレビュー URL | 低 | MVP では main 直本番で十分 |
| `actions/*` のコミット SHA pinning | 中 | サプライチェーン攻撃対策 |
