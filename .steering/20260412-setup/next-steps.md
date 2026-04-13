# Next Steps - 初回セットアップ完了後

**生成日**: 2026-04-12

## 作成したドキュメント一覧

| ファイル | 説明 |
|---------|------|
| `docs/product-requirements.md` | プロダクト要求定義書 — 5ページ構成のMVP定義、KPI、非機能要件 |
| `docs/functional-design.md` | 機能設計書 — データモデル、コンポーネント設計、ワイヤーフレーム、画面遷移 |
| `docs/architecture.md` | 技術仕様書 — 静的サイトアーキテクチャ、コンポーネントレイヤー、CI/CDパイプライン |
| `docs/repository-structure.md` | リポジトリ構造定義書 — ディレクトリ構成、命名規則、依存ルール |
| `docs/development-guidelines.md` | 開発ガイドライン — コーディング規約、Git運用、テスト戦略、レビュー基準 |
| `docs/glossary.md` | 用語集 — ドメイン用語、技術用語、略語、アーキテクチャ概念 |
| `DESIGN.md` | デザインシステム — Vercel Inspired、カラーパレット、タイポグラフィ、コンポーネントスタイリング |

## 次の `/add-feature` 候補

PRDのユーザーストーリーから導出した、推奨実装順序:

### 1. `/add-feature 共通レイアウト（Header・Footer・Navigation）`
- **PRD**: F6 共通レイアウト
- **理由**: 全ページの基盤。最初に実装すべき
- **成果物**: `app/layout.tsx`, `components/layout/Header.tsx`, `components/layout/Footer.tsx`, `components/layout/Navigation.tsx`

### 2. `/add-feature トップページ（HeroSection・StrengthCard）`
- **PRD**: F1 トップページ
- **理由**: ファーストビューの印象を決定する最重要ページ
- **成果物**: `app/page.tsx`, `components/home/HeroSection.tsx`, `components/home/StrengthCard.tsx`

### 3. `/add-feature Aboutページ（Timeline・SkillGrid）`
- **PRD**: F2 経歴・スキルページ
- **理由**: 採用担当者が最も注目するページ
- **成果物**: `app/about/page.tsx`, `components/about/Timeline.tsx`, `components/about/SkillGrid.tsx`

### 4. `/add-feature Projectsページ（ProjectCard）`
- **PRD**: F3 プロジェクト一覧ページ
- **理由**: 技術力を具体的に示すページ
- **成果物**: `app/projects/page.tsx`, `components/projects/ProjectCard.tsx`

### 5. `/add-feature Blog・Contactページ`
- **PRD**: F4 ブログリンク集 + F5 コンタクト
- **理由**: 比較的シンプルなページ。まとめて実装可能
- **成果物**: `app/blog/page.tsx`, `app/contact/page.tsx`, `components/blog/BlogCard.tsx`, `components/contact/SocialLinkCard.tsx`

## プロジェクトタイプ別の補足情報

### Webアプリ（Next.js）

#### 依存関係のインストール

```bash
npm ci
```

#### 開発サーバーの起動

```bash
npm run dev
# → http://localhost:3000
```

#### ビルド確認

```bash
npm run build
# → out/ ディレクトリに静的ファイルが出力される
```

#### 環境変数

MVPでは環境変数は不要。すべてのデータは `src/data/` 内のTypeScriptファイルで管理。

### インフラ（Terraform）— 別リポジトリ

インフラリソースは `/workspaces/cc_aws_portfolio` で管理:

```bash
cd /workspaces/cc_aws_portfolio
terraform init
terraform plan
terraform apply
```

S3バケット、CloudFront Distribution、IAMロール（GitHub Actions OIDC用）等はすべてTerraformで定義。
