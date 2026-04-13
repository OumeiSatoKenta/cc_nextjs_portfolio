# ポートフォリオ実装計画書

## 概要
Next.js（Static Export）+ AWS（CloudFront / S3 / ACM / Route 53）構成のポートフォリオサイトを構築する。
インフラはTerraformで管理し、CI/CDはGitHub Actionsで自動化する。

---

## リポジトリ構成

```
portfolio-site/       # Next.jsのサイト本体 + GitHub Actions
portfolio-infra/      # Terraformのインフラコード
```

---

## 1. portfolio-infra（Terraform）

### ディレクトリ構成

```
portfolio-infra/
├── README.md                    # インフラ構成図・設計判断の説明
├── .gitignore
├── terraform/
│   ├── main.tf                  # プロバイダー設定
│   ├── variables.tf             # 変数定義
│   ├── outputs.tf               # 出力値
│   ├── terraform.tfvars.example # 変数値のサンプル（実値はgitignore）
│   ├── s3.tf                    # S3バケット（静的ホスティング）
│   ├── cloudfront.tf            # CloudFrontディストリビューション
│   ├── acm.tf                   # ACM証明書（us-east-1）
│   ├── route53.tf               # DNSレコード
│   └── iam.tf                   # GitHub Actions用デプロイIAMユーザー/ロール
└── docs/
    └── architecture.drawio      # 構成図（draw.ioなど）
```

### リソース詳細

| リソース | 設定ポイント |
|---------|-------------|
| **S3** | バケットポリシーでCloudFrontのOAC経由のみ許可。パブリックアクセスブロック有効。静的ホスティング設定は不要（CloudFront経由のため） |
| **CloudFront** | OAC（Origin Access Control）でS3と接続。デフォルトルートオブジェクト `index.html`。カスタムエラーレスポンスで404→`/404.html`。gzip/Brotli圧縮有効 |
| **ACM** | `us-east-1` リージョンで作成（CloudFront要件）。DNS検証。ドメイン + `www` サブドメインのSAN証明書 |
| **Route 53** | Aレコード（Aliasで CloudFront指定）。wwwのCNAMEまたはAlias |
| **IAM** | GitHub Actions用のIAMユーザーまたはOIDCプロバイダー。S3へのPut/Delete + CloudFrontのCreateInvalidation権限のみ |

### 設計判断メモ（README.mdに記載する内容）
- OAI ではなく OAC を採用する理由（AWS推奨、署名v4対応）
- GitHub Actions OIDC vs IAMユーザーのトレードオフ（OIDC推奨だがシンプルさとの兼ね合い）
- CloudFront Functions vs Lambda@Edge の不要判断（静的サイトなので不要）
- tfstate管理：S3 + DynamoDB backend（個人利用ならlocalでも可、ただしリポジトリ公開するならremote推奨）

### tfstate管理

```
# 先にS3バケット + DynamoDBテーブルを手動 or 別Terraformで作成
terraform {
  backend "s3" {
    bucket         = "portfolio-tfstate-<account-id>"
    key            = "portfolio/terraform.tfstate"
    region         = "ap-northeast-1"
    dynamodb_table = "portfolio-tfstate-lock"
  }
}
```

### 月額コスト見込み
- Route 53 ホストゾーン: $0.50/月
- ドメイン: 年額$10〜15程度（.devや.comなど）
- S3 / CloudFront / ACM: 個人ポートフォリオのトラフィックならほぼ$0
- **合計: 月額 $1 未満**

---

## 2. portfolio-site（Next.js）

### ディレクトリ構成

```
portfolio-site/
├── README.md
├── .gitignore
├── .github/
│   └── workflows/
│       └── deploy.yml           # S3デプロイ + CloudFrontキャッシュ無効化
├── next.config.js               # output: 'export' 設定
├── package.json
├── tsconfig.json
├── public/
│   └── images/                  # OGP画像、ファビコン等
├── src/
│   ├── app/
│   │   ├── layout.tsx           # 共通レイアウト（ヘッダー・フッター）
│   │   ├── page.tsx             # トップページ（ヒーロー + サマリー）
│   │   ├── about/
│   │   │   └── page.tsx         # 経歴・スキル
│   │   ├── projects/
│   │   │   └── page.tsx         # プロジェクト一覧
│   │   ├── blog/
│   │   │   └── page.tsx         # テックブログ記事へのリンク集
│   │   └── contact/
│   │       └── page.tsx         # 連絡先（GitHub/SNSリンク等）
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── SkillCard.tsx
│   │   ├── ProjectCard.tsx
│   │   └── Timeline.tsx         # 経歴タイムライン
│   ├── data/
│   │   ├── skills.ts            # スキルデータ
│   │   ├── projects.ts          # プロジェクトデータ
│   │   └── career.ts            # 経歴データ
│   └── styles/
│       └── globals.css
└── out/                         # Static Export出力先（gitignore）
```

### ページ構成

| ページ | 内容 |
|-------|------|
| **トップ（/）** | ヒーローセクション + 簡単な自己紹介 + 強みのサマリー3つ（マルチクラウド / AI駆動開発 / パフォーマンス改善） |
| **About（/about）** | 経歴タイムライン（シャノン→DMM→アイスタイル→ミラティブ→オルトプラス）、スキル一覧、資格・学歴 |
| **Projects（/projects）** | 公開できるプロジェクト・リポジトリの紹介。構成図 + 設計判断 + 使った技術のカード形式 |
| **Blog（/blog）** | テックブログ記事・Zenn記事・書籍へのリンク集 |
| **Contact（/contact）** | GitHub / X(Twitter) / connpass 等のリンク |

### Next.js設定ポイント

```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',        // 静的ファイル出力
  images: {
    unoptimized: true,     // Static Exportでは画像最適化を無効化
  },
  trailingSlash: true,     // CloudFront + S3でのルーティング対応
};
module.exports = nextConfig;
```

- `trailingSlash: true` が重要。これがないと `/about` にアクセスしたときにS3で404になる
- `output: 'export'` で `out/` ディレクトリに静的ファイルが出力される

### 技術スタック
- **Next.js 14+**（App Router, Static Export）
- **TypeScript**
- **Tailwind CSS**（ユーティリティベースで管理しやすい）
- **Framer Motion**（アニメーション、なくてもOK）

---

## 3. CI/CD（GitHub Actions）

### deploy.yml

```yaml
name: Deploy to S3

on:
  push:
    branches: [main]

permissions:
  id-token: write    # OIDC用
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run build

      # OIDC認証の場合
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::<ACCOUNT_ID>:role/github-actions-deploy
          aws-region: ap-northeast-1

      - name: Deploy to S3
        run: aws s3 sync out/ s3://<BUCKET_NAME> --delete

      - name: Invalidate CloudFront cache
        run: |
          aws cloudfront create-invalidation \
            --distribution-id <DISTRIBUTION_ID> \
            --paths "/*"
```

### ポイント
- OIDC連携にすればIAMアクセスキーの管理が不要（セキュリティ的にも良いしアピールにもなる）
- `--delete` オプションで古いファイルを自動削除
- CloudFrontキャッシュ無効化は `/*` で全体を対象（個人サイトならコスト気にしなくてOK）

---

## 4. 実装の進め方（推奨順序）

### Phase 1：インフラ構築（1〜2日）
1. `portfolio-infra` リポジトリ作成
2. tfstate用のS3バケット + DynamoDBを作成
3. Terraformでリソース構築（S3 → ACM → CloudFront → Route 53の順）
4. 手動でテスト用HTMLをS3にアップロードして表示確認
5. READMEに構成図と設計判断を記載

### Phase 2：サイト構築（2〜3日）
1. `portfolio-site` リポジトリ作成
2. Next.jsプロジェクト初期化（`npx create-next-app@latest`）
3. `next.config.js` にStatic Export設定
4. ページ・コンポーネントを実装
5. `npm run build` → `out/` の出力確認
6. 手動で `aws s3 sync out/ s3://...` して動作確認

### Phase 3：CI/CD構築（半日）
1. IAM OIDCプロバイダー + ロールをTerraformで追加
2. GitHub Actionsワークフロー作成
3. mainブランチにpushして自動デプロイ確認

### Phase 4：コンテンツ充実（継続的）
1. Claude Code関連のリポジトリを公開してProjectsページにリンク
2. テックブログ記事を書いてBlogページにリンク
3. 構成図や設計判断の記事を追加

---

## 5. ポートフォリオとしてのアピールポイント

このプロジェクト自体が以下をアピールできる：

- **Terraform によるIaC管理**: インフラ全体がコード化されている
- **AWSの実務力**: CloudFront + S3 + ACM + Route 53の構成理解
- **セキュリティ意識**: OAC採用、IAM最小権限、OIDC連携
- **CI/CD設計**: GitHub ActionsによるGitOps的デプロイフロー
- **コスト最適化意識**: 月額$1未満の構成設計