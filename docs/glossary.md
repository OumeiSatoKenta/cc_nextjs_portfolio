<!-- 生成日: 20260412 -->

# プロジェクト用語集 (Glossary)

## 概要

このドキュメントは、ポートフォリオサイトプロジェクトで使用される用語の定義を管理します。

**更新日**: 2026-04-12

## ドメイン用語

プロジェクト固有のビジネス概念や機能に関する用語。

### ポートフォリオサイト (Portfolio Site)

**定義**: エンジニアの技術力・経歴・実績を紹介するための個人Webサイト

**説明**: Next.js Static Exportで生成した静的HTMLをCloudFront + S3で配信する。5ページ構成（トップ・About・Projects・Blog・Contact）でMVPを構成し、サイト構築プロセス自体が技術力の証明となることを目指す。

**関連用語**: [Static Export](#static-export)、[強みサマリー](#強みサマリー)

### 強みサマリー (Strength Summary)

**定義**: トップページに表示される3つの技術的強みを要約したカード群

**説明**: 以下の3つの強みをStrengthCardコンポーネントで表示する。各カードにはWorkflow Accent Colorが割り当てられている。

| 強み | アクセントカラー | 値 |
|------|----------------|------|
| マルチクラウド対応力 | Develop Blue | `#0a72ef` |
| AI駆動開発 | Preview Pink | `#de1d8d` |
| パフォーマンス改善 | Ship Red | `#ff5b4f` |

**関連用語**: [Workflow Accent Colors](#workflow-accent-colors)、[StrengthCard](#strengthcard)

**使用例**:
- トップページのヒーローセクション直下に配置
- 各カードから関連プロジェクトへの導線を提供

### フィーチャードプロジェクト (Featured Project)

**定義**: トップページに優先表示されるプロジェクト

**説明**: `Project` データモデルの `featured: true` で指定される。このポートフォリオサイト自体もフィーチャードプロジェクトとして掲載される。

**関連用語**: [Project（データモデル）](#エンティティ-project)

### コンテンツデータ (Content Data)

**定義**: `src/data/` 配下のTypeScriptファイルで管理されるサイトの表示コンテンツ

**説明**: CMS不使用の設計方針により、スキル・プロジェクト・経歴・ブログ記事・SNSリンクの全データをTypeScriptファイルとして管理する。型安全性が保証され、ビルド時に検証される。

**関連ファイル**:
- `src/data/skills.ts` — スキル一覧
- `src/data/projects.ts` — プロジェクト一覧
- `src/data/career.ts` — 経歴データ
- `src/data/blog.ts` — ブログ記事リンク
- `src/data/social.ts` — SNS・外部リンク

### Workflow Accent Colors

**定義**: Vercel Inspiredデザインシステムにおける3色のアクセントカラー

**説明**: 本プロジェクトではポートフォリオの3つの強み（マルチクラウド / AI駆動開発 / パフォーマンス改善）に対応させて使用する。StrengthCardのアクセントとしてのみ使用し、装飾目的での使用は禁止。

**関連用語**: [強みサマリー](#強みサマリー)、[DESIGN.md](#designmd)

### Shadow-as-Border

**定義**: CSS `border` の代わりに `box-shadow` でボーダー表現を実現するデザイン技法

**説明**: DESIGN.mdで定義されたVercel Inspiredデザインシステムの特徴的な技法。`box-shadow: 0px 0px 0px 1px rgba(0,0,0,0.08)` を使用することで、レイアウトシフトを防ぎつつ繊細なボーダー表現を実現する。CSS `border` の使用は原則禁止。

**関連用語**: [DESIGN.md](#designmd)

**使用例**:
```css
/* カードのshadow-as-border */
box-shadow:
  rgba(0,0,0,0.08) 0px 0px 0px 1px,
  rgba(0,0,0,0.04) 0px 2px 2px,
  rgba(0,0,0,0.04) 0px 8px 8px -8px,
  #fafafa 0px 0px 0px 1px;
```

## 技術用語

プロジェクトで使用している技術・フレームワーク・ツールに関する用語。

### Next.js

**定義**: Reactベースのフルスタックフレームワーク

**本プロジェクトでの用途**: App RouterとStatic Exportを組み合わせ、静的HTMLを生成するために使用。`next/font`によるGeistフォントの標準搭載も活用。

**バージョン**: 14+

**関連ドキュメント**: [技術仕様書](./architecture.md)、[機能設計書](./functional-design.md)

**設定ファイル**: `next.config.js`

### App Router

**定義**: Next.js 13+で導入されたファイルシステムベースのルーティング機構

**本プロジェクトでの用途**: `app/` ディレクトリ配下の `layout.tsx` で共通レイアウト（Header/Footer）を実装し、各ルートの `page.tsx` でページコンテンツを定義する。

**関連用語**: [Static Export](#static-export)

### Static Export

**定義**: Next.jsのビルドモードの一つ。全ページを静的HTMLファイルとして出力する機能

**本プロジェクトでの用途**: `next.config.js` に `output: 'export'` を設定し、`npm run build` で `out/` ディレクトリに全ページを `/about/index.html` 形式で出力する。S3 + CloudFrontでの静的ホスティングに対応。

**設定**:
- `output: 'export'` — Static Export有効化
- `trailingSlash: true` — CloudFront + S3ルーティング対応
- `images: { unoptimized: true }` — Static Export制約による画像最適化無効化

**関連用語**: [App Router](#app-router)

### TypeScript

**定義**: JavaScriptに静的型付けを追加したプログラミング言語

**本プロジェクトでの用途**: 全ソースコードをTypeScriptで記述。`strict: true` モードで型安全性を確保し、データモデル・コンポーネントPropsの型定義により品質を担保。

**バージョン**: 5.x

**関連ドキュメント**: [開発ガイドライン](./development-guidelines.md#TypeScript規約)

**設定ファイル**: `tsconfig.json`

### Tailwind CSS

**定義**: ユーティリティファーストのCSSフレームワーク

**本プロジェクトでの用途**: DESIGN.mdのデザイントークンを `tailwind.config.ts` に反映し、ユーティリティクラスを通じてスタイルを適用する。モバイルファーストのレスポンシブデザインに使用。

**バージョン**: 3.x

**関連ドキュメント**: [開発ガイドライン](./development-guidelines.md#Tailwind-CSS規約)

**設定ファイル**: `tailwind.config.ts`

### Geist フォント

**定義**: Vercelが開発したフォントファミリー。Sans（本文・見出し用）とMono（コード・技術ラベル用）の2種類

**本プロジェクトでの用途**: `next/font/google` 経由で読み込み、DESIGN.mdで定義された3ウェイト制（400/500/600）で使用する。

**関連用語**: [DESIGN.md](#designmd)

### DESIGN.md

**定義**: AIエージェント向けのデザインシステム記述フォーマット（Google Stitch発）

**本プロジェクトでの用途**: プロジェクトルートに配置し、カラーパレット・タイポグラフィ・コンポーネントスタイリング・レイアウトルールを定義する。Vercel Inspiredテンプレートを採用。DESIGN.mdがデザインの真実の源泉であり、`tailwind.config.ts` が二重の制約レイヤーとして機能する。

**関連ドキュメント**: [開発ガイドライン](./development-guidelines.md#デザインシステムとの連携)

### デザイントークン (Design Token)

**定義**: デザインシステムで定義されたカラー・フォント・スペーシング等の設計値

**本プロジェクトでの用途**: DESIGN.mdで定義し、`tailwind.config.ts` のテーマ拡張に反映する。コンポーネントはTailwindユーティリティクラス経由でのみトークンを参照する。フレームワークのデフォルト値や独自の値の発明は禁止。

**関連用語**: [DESIGN.md](#designmd)、[Tailwind CSS](#tailwind-css)

### Framer Motion

**定義**: React向けの宣言的アニメーションライブラリ

**本プロジェクトでの用途**: Post-MVP（P1）で導入予定。ページ遷移アニメーション、スクロールアニメーション、ホバーエフェクトに使用する。

**関連ドキュメント**: [プロダクト要求定義書](./product-requirements.md) F8

### devcontainer

**定義**: VS CodeのRemote Containers機能で使用する開発環境コンテナ定義

**本プロジェクトでの用途**: 開発環境の差分を排除し、Node.js v24.11.0 + npm 11.xの統一環境を提供する。`.devcontainer/devcontainer.json` で定義。

**設定ファイル**: `.devcontainer/devcontainer.json`

## 略語・頭字語

### CDN

**正式名称**: Content Delivery Network

**意味**: コンテンツをエッジサーバーに分散配置し、ユーザーに最も近い地点から配信する仕組み

**本プロジェクトでの使用**: AWS CloudFrontをCDNとして使用。静的ファイルのキャッシュと高速配信を担う。

### LCP

**正式名称**: Largest Contentful Paint

**意味**: ページの主要コンテンツが表示されるまでの時間を計測するCore Web Vitals指標

**本プロジェクトでの使用**: 目標値2.5秒以内。Static Exportによる高速配信で達成見込み。

### CLS

**正式名称**: Cumulative Layout Shift

**意味**: ページ読み込み中の予期しないレイアウトの移動量を計測するCore Web Vitals指標

**本プロジェクトでの使用**: 目標値0.1以下。フォント読み込みの最適化とshadow-as-border技法で対策。

### INP

**正式名称**: Interaction to Next Paint

**意味**: ユーザー操作に対するブラウザの視覚的応答遅延を計測するCore Web Vitals指標。FID（First Input Delay）の後継として2024年3月に導入。

**本プロジェクトでの使用**: 目標値200ms以内。静的サイトのためJavaScript量が少なく自動達成の見込み。

### CSP

**正式名称**: Content Security Policy

**意味**: XSS攻撃を軽減するためのHTTPレスポンスヘッダー

**本プロジェクトでの使用**: CloudFrontのレスポンスヘッダーポリシーで設定。cc_aws_portfolioリポジトリのTerraformで管理。

### OGP

**正式名称**: Open Graph Protocol

**意味**: SNS等でWebページがシェアされた際のプレビュー情報を定義するメタデータ規格

**本プロジェクトでの使用**: 各ページに `og:title`, `og:description`, `og:image` を設定。OGP画像の自動生成はPost-MVP（P2）。

### SSR

**正式名称**: Server-Side Rendering

**意味**: サーバー側でHTMLを動的に生成するレンダリング手法

**本プロジェクトでの使用**: 本プロジェクトではSSRを使用しない。Static Exportによる静的HTMLのみ。スコープ外として明示的に除外。

### CI/CD

**正式名称**: Continuous Integration / Continuous Delivery

**意味**: コードの統合・テスト・デプロイを自動化するプラクティス

**本プロジェクトでの使用**: GitHub Actionsで実装。`main` ブランチへのpush時に `npm ci → npm run build → aws s3 sync → CloudFront invalidation` を自動実行。

### IaC

**正式名称**: Infrastructure as Code

**意味**: インフラ構成をコードで定義し、バージョン管理する手法

**本プロジェクトでの使用**: AWSインフラ（S3、CloudFront、IAMロール等）はcc_aws_portfolioリポジトリのTerraformで管理。本リポジトリ（cc_nextjs_portfolio）はアプリケーションコードのみ。

### OIDC

**正式名称**: OpenID Connect

**意味**: OAuth 2.0ベースの認証プロトコル

**本プロジェクトでの使用**: GitHub ActionsからAWSへの認証に使用。IAMアクセスキーを使わず、OIDC連携でセキュアに認証する。

### MVP

**正式名称**: Minimum Viable Product

**意味**: 最小限の機能で構成されたプロダクトの初期バージョン

**本プロジェクトでの使用**: 5ページ構成（トップ・About・Projects・Blog・Contact）+ 共通レイアウト + Static Export対応をMVPスコープとして定義。P0機能がMVPに該当する。

## アーキテクチャ用語

### 静的サイトアーキテクチャ (Static Site Architecture)

**定義**: ビルド時に全ページをHTMLファイルとして生成し、CDN + オブジェクトストレージで配信するアーキテクチャパターン

**本プロジェクトでの適用**: Next.js Static Exportで `out/` に全ページを出力し、S3にアップロード、CloudFrontで配信する。サーバーサイドランタイムを持たないため攻撃表面が極めて小さい。

**図解**:
```
ブラウザ → CloudFront(CDN) → S3(オリジン)
                                ↑
GitHub Actions → npm run build → out/ → aws s3 sync
```

**メリット**:
- 高速な配信（エッジキャッシュ）
- 低コスト（サーバー不要）
- 高セキュリティ（攻撃表面が小さい）
- 高可用性（CDNの冗長性）

**デメリット**:
- 動的コンテンツの制約（API Routes不可）
- コンテンツ更新にはビルド・デプロイが必要

### コンポーネントレイヤーアーキテクチャ

**定義**: UIコンポーネントを責務に応じてレイヤーに分け、一方向の依存関係を持たせる設計パターン

**本プロジェクトでの適用**:

| レイヤー | 配置 | 責務 |
|---------|------|------|
| ページ | `app/*/page.tsx` | ページ構成、データ読み込み |
| セクション | `components/home/`, `components/about/` 等 | ページ内セクションの表示 |
| UIパーツ | `components/ui/` | 再利用可能な最小UIコンポーネント |
| レイアウト | `components/layout/` | 共通Header・Footer・Navigation |
| データ | `src/data/` | コンテンツデータ定義 |
| 型定義 | `src/types/` | 共有型定義 |

**依存ルール**:
- ページ → セクション → UIパーツ（一方向のみ）
- コンポーネントから `src/data/` への直接importは禁止（Propsで受け渡す）
- 型定義（`src/types/`）は全レイヤーから参照可能

### 2リポジトリ分離 (Two-Repository Split)

**定義**: アプリケーションコードとインフラコードを別リポジトリで管理する設計方針

**本プロジェクトでの適用**:

| リポジトリ | 内容 | 技術 |
|-----------|------|------|
| `cc_nextjs_portfolio` | アプリケーション（UI・コンテンツ） | Next.js, TypeScript, Tailwind CSS |
| `cc_aws_portfolio` | インフラ（S3, CloudFront, IAM等） | Terraform |

**分離理由**:
- ライフサイクルの違い（UIは頻繁更新、インフラは安定運用）
- 権限分離（デプロイ権限とインフラ変更権限を分ける）
- ツールチェーンの違い（Node.js vs Terraform）

### デザインシステム二重制約 (Two-Layer Design Constraint)

**定義**: DESIGN.mdとtailwind.config.tsの2層でデザイントークンの一貫性を担保する設計パターン

**本プロジェクトでの適用**:
1. **DESIGN.md** — デザインの真実の源泉（AIエージェントが参照）
2. **tailwind.config.ts** — DESIGN.mdのトークンをTailwind CSSテーマに反映（技術的強制力）
3. **コンポーネント** — Tailwindユーティリティクラス経由でのみトークンを使用

**メリット**: AIエージェントと人間の両方がデザインの一貫性を維持できる

## データモデル用語

### エンティティ: Skill

**定義**: エンジニアの技術スキルを表すデータモデル

**主要フィールド**:
- `name`: スキル名（例: "TypeScript"）
- `category`: カテゴリ（language / framework / cloud / tool / database / other）
- `level`: 習熟度（expert / advanced / intermediate / beginner、任意）

**関連エンティティ**: なし

**管理ファイル**: `src/data/skills.ts`、`src/types/index.ts`

### エンティティ: Project

**定義**: ポートフォリオに掲載するプロジェクトを表すデータモデル

**主要フィールド**:
- `id`: 一意識別子（slug形式: "portfolio-site"）
- `title`: プロジェクト名
- `description`: 概要（1-3文）
- `technologies`: 使用技術タグ（string[]）
- `githubUrl`: GitHubリポジトリURL（任意）
- `featured`: トップページに表示するか（boolean）
- `highlights`: 設計判断・技術的ハイライト（任意）

**関連エンティティ**: なし

**管理ファイル**: `src/data/projects.ts`、`src/types/index.ts`

### エンティティ: Career

**定義**: 職歴・経歴を表すデータモデル

**主要フィールド**:
- `company`: 会社名
- `role`: 役職・ポジション
- `period`: 在籍期間（start / end）
- `achievements`: 主な成果（string[]）

**関連エンティティ**: なし

**管理ファイル**: `src/data/career.ts`、`src/types/index.ts`

### エンティティ: BlogPost

**定義**: 外部ブログ記事へのリンク情報を表すデータモデル

**主要フィールド**:
- `title`: 記事タイトル
- `url`: 記事URL（外部サイト）
- `publishedAt`: 投稿日
- `platform`: プラットフォーム名（例: "Zenn"）
- `description`: 概要（任意）

**関連エンティティ**: なし

**管理ファイル**: `src/data/blog.ts`、`src/types/index.ts`

### エンティティ: SocialLink

**定義**: SNS・外部プラットフォームへのリンク情報を表すデータモデル

**主要フィールド**:
- `platform`: プラットフォーム名（例: "GitHub"）
- `url`: プロフィールURL
- `icon`: アイコン識別子（lucide-reactのアイコン名）

**関連エンティティ**: なし

**管理ファイル**: `src/data/social.ts`、`src/types/index.ts`

### エンティティ: Education

**定義**: 資格・学歴情報を表すデータモデル

**主要フィールド**:
- `type`: 種別（certification = 資格 / degree = 学歴）
- `title`: 資格名または学位名（例: "AWS Solutions Architect Associate"）
- `institution`: 発行機関または学校名（任意）
- `date`: 取得日または卒業年月（"2024-03" 形式）

**関連エンティティ**: なし

**管理ファイル**: `src/data/education.ts`、`src/types/index.ts`

## コンポーネント用語

### StrengthCard

**定義**: トップページで3つの強みを表示するカードコンポーネント

**責務**: 強みのタイトル・説明・Workflow Accent Colorアクセントの表示

**レイヤー**: セクションコンポーネント（`components/home/`）

**関連用語**: [強みサマリー](#強みサマリー)、[Workflow Accent Colors](#workflow-accent-colors)

### ExternalLink

**定義**: 外部サイトへのリンクにセキュリティ属性を強制するUIコンポーネント

**責務**: `target="_blank"` と `rel="noopener noreferrer"` を自動付与する

**レイヤー**: UIパーツ（`components/ui/`）

**テスト優先度**: 高

### Timeline / TimelineItem

**定義**: Aboutページで経歴を時系列表示するコンポーネント群

**責務**: Timeline（コンテナ）がTimelineItem（各経歴エントリ）を垂直に配置する

**レイヤー**: セクションコンポーネント（`components/about/`）

## 索引

### あ行
- [アクセントカラー](#workflow-accent-colors) - ドメイン用語

### か行
- [強みサマリー](#強みサマリー) - ドメイン用語
- [コンテンツデータ](#コンテンツデータ-content-data) - ドメイン用語
- [コンポーネントレイヤーアーキテクチャ](#コンポーネントレイヤーアーキテクチャ) - アーキテクチャ用語

### さ行
- [静的サイトアーキテクチャ](#静的サイトアーキテクチャ-static-site-architecture) - アーキテクチャ用語

### た行
- [デザイントークン](#デザイントークン-design-token) - 技術用語
- [デザインシステム二重制約](#デザインシステム二重制約-two-layer-design-constraint) - アーキテクチャ用語

### は行
- [フィーチャードプロジェクト](#フィーチャードプロジェクト-featured-project) - ドメイン用語
- [ポートフォリオサイト](#ポートフォリオサイト-portfolio-site) - ドメイン用語

### ら行
- [2リポジトリ分離](#2リポジトリ分離-two-repository-split) - アーキテクチャ用語

### A-Z
- [App Router](#app-router) - 技術用語
- [BlogPost](#エンティティ-blogpost) - データモデル用語
- [Career](#エンティティ-career) - データモデル用語
- [CDN](#cdn) - 略語
- [CI/CD](#cicd) - 略語
- [CLS](#cls) - 略語
- [CSP](#csp) - 略語
- [DESIGN.md](#designmd) - 技術用語
- [devcontainer](#devcontainer) - 技術用語
- [Education](#エンティティ-education) - データモデル用語
- [ExternalLink](#externallink) - コンポーネント用語
- [INP](#inp) - 略語
- [Framer Motion](#framer-motion) - 技術用語
- [Geist フォント](#geist-フォント) - 技術用語
- [IaC](#iac) - 略語
- [LCP](#lcp) - 略語
- [MVP](#mvp) - 略語
- [Next.js](#nextjs) - 技術用語
- [OGP](#ogp) - 略語
- [OIDC](#oidc) - 略語
- [Project](#エンティティ-project) - データモデル用語
- [Shadow-as-Border](#shadow-as-border) - ドメイン用語
- [Skill](#エンティティ-skill) - データモデル用語
- [SocialLink](#エンティティ-sociallink) - データモデル用語
- [SSR](#ssr) - 略語
- [Static Export](#static-export) - 技術用語
- [StrengthCard](#strengthcard) - コンポーネント用語
- [Tailwind CSS](#tailwind-css) - 技術用語
- [Timeline](#timeline--timelineitem) - コンポーネント用語
- [TypeScript](#typescript) - 技術用語
- [Workflow Accent Colors](#workflow-accent-colors) - ドメイン用語
