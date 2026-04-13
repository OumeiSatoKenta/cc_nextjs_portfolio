# CI/CD ナレッジ

GitHub Actions を中心とした CI/CD パイプラインの教訓・パターンを記録する。

## GitHub Actions OIDC × AWS 連携

### `${{ secrets.* }}` をシェル行に直接展開しない

**やってはいけない**:
```yaml
- run: aws s3 sync out/ s3://${{ secrets.S3_BUCKET_NAME }}/ --delete
```

**正しい**:
```yaml
- env:
    S3_BUCKET_NAME: ${{ secrets.S3_BUCKET_NAME }}
  run: aws s3 sync out/ "s3://${S3_BUCKET_NAME}/" --delete
```

理由: `${{ }}` は GitHub Actions の式展開でシェル行の文字列に埋め込まれる。Secret が悪意ある値（`foo ; curl attacker.com`）だった場合、任意のシェルコマンドが実行される。`env:` 経由なら環境変数として渡るため、シェルは単なる文字列として扱う。

### `persist-credentials: false` を `actions/checkout` に付ける

後続ステップに `npm ci` や `postinstall` など「リポジトリ由来の任意コード実行」がある限り、`GITHUB_TOKEN` を Git 設定に残さない方が攻撃面が小さい。

```yaml
- uses: actions/checkout@v4
  with:
    persist-credentials: false
```

`permissions: contents: read` でも最小化はできているが、二重防御として推奨。

### 本番デプロイ系ワークフローに `if: github.ref == 'refs/heads/main'` を付ける

`workflow_dispatch: {}` は UI から任意ブランチを選択して実行できてしまう。`inputs.ref` で縛らない限り、`feature/xxx` ブランチを本番にデプロイできる抜け道になる。ジョブレベルの `if` 条件でブランチを限定することで構造的に封じる。

```yaml
jobs:
  deploy:
    if: github.ref == 'refs/heads/main'
```

### `permissions:` は最小化し、`id-token: write` を PR 系ワークフローに広げない

- CI (PR): `contents: read` のみ
- Deploy (main): `id-token: write` + `contents: read`

ワークフローファイルを分離することで、PR に誤って OIDC 権限が広がるリスクを構造的に排除できる。責務分離 > YAML 行数削減。

## `concurrency` の使い分け

トリガーの性質で `cancel-in-progress` の真偽を**正反対に**する:

| ワークフロー | group | cancel-in-progress | 理由 |
|------------|-------|-------------------|------|
| PR CI | `${{ github.workflow }}-${{ github.ref }}` | `true` | 同一 PR の古いランは捨てる |
| Production Deploy | `${{ github.workflow }}-production` | `false` | 先行デプロイを待つ（`--delete` と競合しない） |

`group` 名には `${{ github.workflow }}` を含めることで、将来別ワークフロー追加時の意図せぬ干渉を防ぐ。

## `npm audit` の `--audit-level` を「実攻撃面」で決める

PRD の非機能要件で「脆弱性ゼロ」を謳っていても、依存関係の high 以下を含めた完全ゼロは OSS ベースでは維持困難。

**アーキテクチャ判断で level を下げる例**:
- Next.js Static Export + S3 + CloudFront → サーバーランタイムなし → `next/image` 系 DoS、Server Components DoS は実攻撃面ゼロ → `--audit-level=critical` でゲート可能

**やるべきこと**:
1. requirements.md に「なぜ critical に緩和したか」の根拠を CVE 番号付きで明記
2. 将来のアーキテクチャ変更（ISR 化、Server Components 有効化 等）で再評価する条件を書き残す
3. `high` を無視しているのではなく「手動トリアージ対象」として位置付ける

## 静的サイトの出力検証

`next build` 完了だけでは「必要なページが全部出たか」を保証しない。`out/` の存在を個別確認する:

```bash
set -e
test -d out
test -d out/_next
test -f out/404.html
for page in index about/index projects/index blog/index contact/index; do
  test -f "out/${page}.html" || { echo "Missing: out/${page}.html"; exit 1; }
done
```

`_next/` と `404.html` を追加すると、`trailingSlash` や静的生成の暗黙ドリフトも検出できる。

## セキュリティ観点のレビューは独立した目で

自己分析では「自分が書いたロジックの穴」は見えにくい。以下を並列で回すことで欠陥の検出率が大きく上がる:

1. `code-reviewer-structural` — 構造・責務分離
2. `code-reviewer-secondary` — 欠陥・セキュリティ（Codex MCP でセカンドオピニオン併用）
3. `code-reviewer-docs` — 公式仕様準拠（Context7 MCP でライブラリ最新版確認）

今回の `workflow_dispatch` の ref 問題とシェルインジェクション耐性は、いずれも secondary 軸で初めて [必須] として浮上した。

## クロスリポジトリ依存は「ドキュメント化のみ」に留める

`cc_nextjs_portfolio` のワークフローが動くには `cc_aws_portfolio` 側の `terraform.tfvars` で `github_repo` が一致している必要がある。しかし別リポジトリの修正は本リポジトリのスコープ外。

**正しい対応**: `docs/SETUP.md` の前提条件セクションで「インフラ側でこの修正が必要」と明記し、実際の `terraform apply` はユーザーに委ねる。自動化の誘惑に負けない。
