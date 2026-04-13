# 要求定義: CI/CD デプロイパイプライン（GitHub Actions → S3 → CloudFront）

## 背景

`cc_nextjs_portfolio` は静的サイト（Next.js Static Export）であり、本番は `cc_aws_portfolio`（Terraform）で構築した S3 + CloudFront 上にホスティングする。現時点では手動ビルド・手動デプロイの状態で、以下の課題がある:

- デプロイフローが属人化（手順ミス・アップロード漏れのリスク）
- PR 段階での品質ゲートが未整備（lint/type-check/test の実行が手動依存）
- 本番反映までのリードタイムが長い（手動ビルド → sync → invalidation）
- 永続ドキュメント（`docs/architecture.md` §ビルドパイプライン）が「GitHub Actions による OIDC デプロイ」を定義しているが、リポジトリに `.github/workflows/` が未存在

## 目的

`main` ブランチへの push をトリガーに、以下を自動化する:

1. 品質ゲート（lint / type-check / test / `npm audit`）をパス
2. `npm run build` で `out/` ディレクトリへ静的ファイルを出力
3. AWS OIDC 連携でインフラ側 IAM ロールを AssumeRole（アクセスキー不使用）
4. `aws s3 sync out/ s3://portfolio-site-<account_id>/ --delete` で差分同期
5. `aws cloudfront create-invalidation --paths '/*'` でエッジキャッシュ無効化

PR（非 main）では品質ゲートのみを実行し、デプロイはスキップする。

## スコープ

### 対象範囲

- `.github/workflows/ci.yml`（PR / feature ブランチ用: lint, type-check, test, build 検証）
- `.github/workflows/deploy.yml`（main push 用: 品質ゲート + OIDC デプロイ + CloudFront invalidation）
- GitHub 側の設定手順書（`docs/SETUP.md` もしくは本ステアリング内に記載）
  - `AWS_ROLE_ARN` / `AWS_REGION` / `S3_BUCKET_NAME` / `CLOUDFRONT_DISTRIBUTION_ID` の登録方法
- インフラ側 `cc_aws_portfolio` との前提整合性の明記（`github_repo = "cc_nextjs_portfolio"` への修正が必要であることをドキュメント化）

### 対象外

- インフラ側リソースの変更（`cc_aws_portfolio` の `terraform.tfvars` 修正はユーザーが別リポジトリで実施）
- Lighthouse CI / E2E テスト（Post-MVP）
- プレビュー環境（Post-MVP、staging バケット等）
- Slack/Discord 通知（Post-MVP）

## ユーザーストーリー

### US-1: 開発者としての品質ゲート

**開発者として**、PR を出す前に自動で lint/type-check/test が走ってほしい。壊れたコードを main に入れたくない。

**受け入れ条件**:
- [ ] PR 作成時に `ci.yml` が起動する
- [ ] 実行対象: `npm ci`, `npm run lint`, `npm run type-check`, `npm test`, `npm run build`
- [ ] 上記のいずれかが失敗したら PR のチェックが `failure` になる
- [ ] `main` ブランチへの push では `ci.yml` を実行しない（`deploy.yml` 側で同等のゲートを再実行するため）

**注記（Jest 初期状態対応）**: フェーズ 1 実装時点ではテストスイートが実装中のため、CI では `npm test -- --passWithNoTests` 相当でテスト 0 件を許容する。MVP テスト完備後に `--passWithNoTests` を外す（本ステアリング完了時点では共通レイアウトのテスト 19 ケースが存在するため付与不要だが、将来的にゼロになるリスクを想定しておく）。

### US-2: 開発者としての自動デプロイ

**開発者として**、main にマージしたら自動的に本番反映されてほしい。手動でビルド・sync・invalidation を叩く手間をなくしたい。

**受け入れ条件**:
- [ ] `main` への push 時に `deploy.yml` が起動する
- [ ] 品質ゲート（lint/type-check/test）が通った後にのみビルド・デプロイが進む
- [ ] OIDC で IAM ロールを AssumeRole（静的クレデンシャル不使用）
- [ ] `aws s3 sync out/ s3://<bucket>/ --delete` が成功する
- [ ] `aws cloudfront create-invalidation --paths '/*'` が成功する
- [ ] ワークフロー全体が 10 分以内に完了する（初回 `npm ci` を含むキャッシュ未ヒット時）

### US-3: セキュリティ担当としての最小権限

**セキュリティ担当として**、デプロイに使うクレデンシャルを最小権限で運用したい。鍵漏洩のリスクを排除したい。

**受け入れ条件**:
- [ ] IAM アクセスキーを GitHub Secrets に保存しない（OIDC 専用）
- [ ] ワークフローの `permissions:` ブロックで `id-token: write`, `contents: read` のみを宣言
- [ ] IAM ロールの Trust Policy が `sub` 条件で `cc_nextjs_portfolio` の `main` ブランチ push に限定されている（インフラ側の責務）
- [ ] `npm audit --audit-level=critical` が CI で実行され、critical の脆弱性ゼロを維持

**audit-level の根拠**: PRD 非機能要件は「`npm audit` でゼロ脆弱性」を求めているが、OSS 依存で medium / low / high を含む完全ゼロは現実的に維持困難。本プロジェクトは Next.js Static Export + S3 + CloudFront 構成でサーバーランタイムを持たないため、Next.js の `high` CVE（例: GHSA-3x4c-7xq6-9pq8 `next/image` キャッシュ DoS、GHSA-q4gf-8mx6-v5v3 Server Components DoS）は実攻撃面ゼロと判断する。そのため CI では `--audit-level=critical` で「critical」のみをゲートし、high 以下は手動トリアージ対象として扱う。Next.js の上位メジャーへ移行した段階で再評価する。

### US-4: 運用担当としての監査可能性

**運用担当として**、誰がいつ何をデプロイしたかを追跡できるようにしたい。

**受け入れ条件**:
- [ ] デプロイワークフローが GitHub Actions の実行ログに残る（`actions/checkout` のコミット SHA, デプロイ開始・完了時刻）
- [ ] `aws s3 sync` / `aws cloudfront create-invalidation` の出力がログに記録される
- [ ] 失敗時に `job.status == failure` で停止する（部分デプロイを許さない）

## 非機能要件

### パフォーマンス

- ワークフロー実行時間: 10 分以内（npm キャッシュヒット時は 5 分以内を目標）
- `actions/setup-node@v4` の `cache: 'npm'` を利用

### セキュリティ

- `configure-aws-credentials@v4` 以降を使用（v5 系が最新安定版 `v5.0.0`）
- `actions/*` は pinned major version（`@v4`, `@v5`）を使用。コミット SHA pinning は MVP 範囲外（Post-MVP で検討）
- シークレットは **Repository Secrets**（Settings → Secrets and variables → Actions）に保存する。Environment Secrets による分離・承認ゲートは Post-MVP 扱い
- 非機密の設定値（`AWS_REGION` 等の固定値）は Repository Variables（`vars.*`）に保存し、ログ上でマスクされないようにする

### 保守性

- ビルドマトリクス不要（Node.js v24 単一ターゲット）
- `ubuntu-latest` ランナー単一環境
- ワークフロー YAML は 100 行以下を目標（可読性優先）

### 互換性

- Node.js バージョンは `docs/architecture.md` に合わせて `v24`
- Next.js 14.2.35 / Static Export 前提

## 前提条件・依存関係

### インフラ側（`cc_aws_portfolio`）の準備

このワークフローを動作させるには、インフラ側で以下の状態が整っている必要がある:

1. `terraform apply` が完了し、以下の output が取得可能
   - `iam_role_arn` → GitHub Secrets `AWS_ROLE_ARN`
   - `s3_bucket_name` → GitHub Secrets `S3_BUCKET_NAME`
   - `cloudfront_distribution_id` → GitHub Secrets `CLOUDFRONT_DISTRIBUTION_ID`
2. `terraform.tfvars` の `github_repo` が `"cc_nextjs_portfolio"` に修正されている
   - 現状 `cc_aws_portfolio` の値になっているため、このままでは OIDC の Trust Policy で `sub` 条件が合わず AssumeRole が失敗する

### GitHub 側の準備

1. リポジトリ **Secrets**（機密値）に以下 3 つを登録:
   - `AWS_ROLE_ARN`
   - `S3_BUCKET_NAME`
   - `CLOUDFRONT_DISTRIBUTION_ID`
2. リポジトリ **Variables**（非機密値）に以下 1 つを登録:
   - `AWS_REGION`（例: `ap-northeast-1`）
3. Branch Protection で main を保護し、`CI` チェックの合格を必須にする（運用ルール）

## 成功指標

- [ ] PR を 1 件作成し、`ci.yml` が自動実行され全ジョブ成功
- [ ] main に push し、`deploy.yml` が自動実行され S3 への sync + CloudFront invalidation が成功
- [ ] 本番 URL に変更が反映される（invalidation 完了 1-2 分以内）
- [ ] `docs/architecture.md` §ビルドパイプライン の記述と実装が一致
