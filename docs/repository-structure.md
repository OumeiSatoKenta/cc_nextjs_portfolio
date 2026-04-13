<!-- 生成日: 20260412 -->

# リポジトリ構造定義書 (Repository Structure Document)

## プロジェクト構造

```
cc_nextjs_portfolio/
├── .claude/                    # Claude Code設定
│   ├── agents/                 # カスタムエージェント定義
│   └── skills/                 # スキル定義
├── .devcontainer/              # devcontainer設定
│   └── devcontainer.json
├── .github/                    # GitHub設定
│   └── workflows/              # GitHub Actionsワークフロー
│       ├── ci.yml              # PR品質ゲート（lint/type-check/test/audit/build/out検証）
│       └── deploy.yml          # main push時: 品質ゲート + OIDC + S3 sync + CF無効化
├── .steering/                  # 作業単位のドキュメント（タスク管理）
│   └── YYYYMMDD-task-name/
│       ├── requirements.md
│       ├── design.md
│       └── tasklist.md
├── docs/                       # 永続的ドキュメント
│   ├── ideas/                  # アイデア・壁打ちメモ
│   ├── product-requirements.md # PRD
│   ├── functional-design.md    # 機能設計書
│   ├── architecture.md         # 技術仕様書
│   ├── repository-structure.md # 本ドキュメント
│   ├── development-guidelines.md # 開発ガイドライン
│   └── glossary.md             # 用語集
├── knowledge/                  # ナレッジベース（教訓・ルール）
│   ├── general.md
│   ├── frontend.md
│   ├── backend.md
│   └── aws.md
├── public/                     # 静的ファイル（ビルド時にそのままコピー）
│   ├── images/                 # 画像ファイル
│   ├── favicon.ico
│   ├── robots.txt
│   └── sitemap.xml
├── src/                        # アプリケーションソースコード
│   ├── app/                    # App Router（ページ・レイアウト）
│   │   ├── layout.tsx          # ルートレイアウト
│   │   ├── page.tsx            # トップページ（/）
│   │   ├── not-found.tsx       # 404ページ
│   │   ├── about/
│   │   │   └── page.tsx        # 経歴・スキル（/about）
│   │   ├── projects/
│   │   │   └── page.tsx        # プロジェクト一覧（/projects）
│   │   ├── blog/
│   │   │   └── page.tsx        # ブログリンク集（/blog）
│   │   └── contact/
│   │       └── page.tsx        # コンタクト（/contact）
│   ├── components/             # 再利用可能なUIコンポーネント
│   │   ├── layout/             # レイアウト系コンポーネント
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── home/               # トップページ専用コンポーネント
│   │   │   ├── HeroSection.tsx
│   │   │   └── StrengthCard.tsx
│   │   ├── about/              # Aboutページ専用コンポーネント
│   │   │   ├── Timeline.tsx
│   │   │   ├── TimelineItem.tsx
│   │   │   └── SkillGrid.tsx
│   │   ├── projects/           # Projectsページ専用コンポーネント
│   │   │   └── ProjectCard.tsx
│   │   ├── blog/               # Blogページ専用コンポーネント
│   │   │   └── BlogCard.tsx
│   │   ├── contact/            # Contactページ専用コンポーネント
│   │   │   └── SocialLinkCard.tsx
│   │   └── ui/                 # 汎用UIパーツ
│   │       ├── SectionHeading.tsx
│   │       ├── Badge.tsx
│   │       └── ExternalLink.tsx
│   ├── data/                   # コンテンツデータ（TypeScriptファイル）
│   │   ├── metadata.ts         # サイトメタデータ・著者情報
│   │   ├── navigation.ts       # グローバルナビゲーションリンク
│   │   ├── skills.ts           # スキル一覧
│   │   ├── projects.ts         # プロジェクト一覧
│   │   ├── career.ts           # 経歴データ
│   │   ├── blog.ts             # ブログ記事リンク
│   │   └── social.ts           # SNS・外部リンク
│   ├── hooks/                  # 再利用可能なカスタムフック
│   │   └── useActiveNav.ts     # パス境界バグフリーなアクティブ判定
│   └── types/                  # 型定義
│       └── index.ts            # 共有型定義（データモデルインターフェース）
├── __tests__/                  # テストファイル
│   ├── components/             # コンポーネントテスト
│   │   ├── layout/
│   │   │   ├── Header.test.tsx
│   │   │   └── Footer.test.tsx
│   │   ├── home/
│   │   │   └── StrengthCard.test.tsx
│   │   ├── projects/
│   │   │   └── ProjectCard.test.tsx
│   │   ├── blog/
│   │   │   └── BlogCard.test.tsx
│   │   └── ui/
│   │       ├── Badge.test.tsx
│   │       └── ExternalLink.test.tsx
│   └── build/                  # ビルドテスト
│       └── static-export.test.ts
├── CLAUDE.md                   # Claude Code プロジェクト設定
├── DESIGN.md                   # デザインシステム定義（Vercel Inspired）
├── next.config.js              # Next.js設定
├── tailwind.config.ts          # Tailwind CSS設定（DESIGN.mdトークン反映）
├── tsconfig.json               # TypeScript設定
├── postcss.config.js           # PostCSS設定（Tailwind用）
├── package.json                # 依存関係・スクリプト定義
├── package-lock.json           # 依存関係ロックファイル
├── .eslintrc.json              # ESLint設定
├── .prettierrc                 # Prettier設定
└── .gitignore                  # Git除外設定
```

## ディレクトリ詳細

### `src/app/` — App Router（ページ・レイアウト）

| 項目 | 内容 |
|------|------|
| **役割** | Next.js App Routerのルーティングとページ定義 |
| **ファイルパターン** | `page.tsx`, `layout.tsx`, `not-found.tsx` |
| **命名規則** | Next.js App Router規約に準拠（`page.tsx` 固定名） |
| **依存ルール** | `components/`, `data/`, `types/` をimport可能 |

**配置ルール**:
- 各ルートは `app/[route]/page.tsx` で定義
- ルートレイアウト `app/layout.tsx` で共通Header/Footer/メタデータを設定
- ページ固有のロジックは `page.tsx` 内に閉じる
- 複雑なセクションは `components/` のコンポーネントに委譲

### `src/components/` — UIコンポーネント

| 項目 | 内容 |
|------|------|
| **役割** | 再利用可能なReactコンポーネント |
| **ファイルパターン** | `*.tsx` |
| **命名規則** | PascalCase（例: `ProjectCard.tsx`） |
| **依存ルール** | `ui/` は他コンポーネントに依存しない。ページ専用コンポーネントは `ui/` と `types/` のみimport可能 |

**サブディレクトリ構成**:

| ディレクトリ | 用途 | 配置基準 |
|------------|------|---------|
| `layout/` | 全ページ共通のレイアウト部品 | Header, Footer, Navigation |
| `home/` | トップページ（/）専用 | HeroSection, StrengthCard |
| `about/` | Aboutページ（/about）専用 | Timeline, SkillGrid |
| `projects/` | Projectsページ（/projects）専用 | ProjectCard |
| `blog/` | Blogページ（/blog）専用 | BlogCard |
| `contact/` | Contactページ（/contact）専用 | SocialLinkCard |
| `ui/` | ページ横断の汎用UIパーツ | Badge, ExternalLink, SectionHeading |

**配置判断基準**:
- 2ページ以上で使われる → `ui/`
- 1ページでのみ使われる → そのページ専用ディレクトリ
- 全ページで使われるレイアウト要素 → `layout/`

### `src/data/` — コンテンツデータ

| 項目 | 内容 |
|------|------|
| **役割** | サイトに表示するコンテンツデータの定義 |
| **ファイルパターン** | `*.ts`（TSXではない） |
| **命名規則** | camelCase・複数形（例: `skills.ts`, `projects.ts`） |
| **依存ルール** | `types/` のみimport可能。コンポーネントに依存しない |

**各ファイルの責務**:

| ファイル | エクスポート | 説明 |
|---------|------------|------|
| `metadata.ts` | `siteMetadata: SiteMetadata` | サイト名、著者情報、3つの強み |
| `navigation.ts` | `NAV_LINKS: NavLink[]` | グローバルナビゲーションのリンク定義 |
| `skills.ts` | `skills: Skill[]` | スキル一覧（カテゴリ別） |
| `projects.ts` | `projects: Project[]` | プロジェクト一覧 |
| `career.ts` | `careers: Career[]` | 経歴データ（新しい順） |
| `blog.ts` | `blogPosts: BlogPost[]` | ブログ記事リンク（新しい順） |
| `social.ts` | `socialLinks: SocialLink[]` | SNS・外部リンク |

### `src/hooks/` — カスタムフック

| 項目 | 内容 |
|------|------|
| **役割** | 複数コンポーネントで共有するReactロジック（カスタムフック）の集約 |
| **ファイルパターン** | `use*.ts` |
| **命名規則** | camelCase + `use` プレフィックス（例: `useActiveNav.ts`） |
| **依存ルール** | `types/` のみimport可能。コンポーネントやデータに依存しない |

**各ファイルの責務**:

| ファイル | エクスポート | 説明 |
|---------|------------|------|
| `useActiveNav.ts` | `useActiveNav()` | `usePathname` の Static Export 向け null フォールバックと、prefix-only マッチの境界バグを避けた `isActive(href)` 判定を提供 |

### `src/types/` — 型定義

| 項目 | 内容 |
|------|------|
| **役割** | プロジェクト全体で共有する型定義 |
| **ファイルパターン** | `*.ts` |
| **命名規則** | PascalCase（型名）。ファイルは `index.ts` で一元管理 |
| **依存ルール** | 他ディレクトリに依存しない（最下層） |

### `public/` — 静的ファイル

| 項目 | 内容 |
|------|------|
| **役割** | ビルド時にそのまま `out/` にコピーされる静的ファイル |
| **ファイルパターン** | 画像（PNG, WebP, SVG）、favicon、robots.txt、sitemap.xml |
| **命名規則** | kebab-case（例: `og-image.png`） |

### `__tests__/` — テストファイル

| 項目 | 内容 |
|------|------|
| **役割** | ユニットテスト・コンポーネントテスト・ビルドテスト |
| **ファイルパターン** | `*.test.tsx`, `*.test.ts` |
| **命名規則** | テスト対象と同名 + `.test` サフィックス（例: `Header.test.tsx`） |
| **構造** | `src/components/` のディレクトリ構造をミラーリング |

### `docs/` — 永続的ドキュメント

| 項目 | 内容 |
|------|------|
| **役割** | プロジェクトの設計・要件・ガイドラインを記述する永続ドキュメント |
| **ファイルパターン** | `*.md` |
| **配置基準** | プロジェクト全体の方針に関わるドキュメント |

### `.steering/` — 作業単位のドキュメント

| 項目 | 内容 |
|------|------|
| **役割** | 特定の作業タスクに紐づく設計・計画・進捗管理 |
| **ファイルパターン** | `*.md` |
| **命名規則** | `YYYYMMDD-task-name/`（例: `20260415-add-hero-section/`） |
| **ライフサイクル** | 作業開始時に作成。完了後も履歴として保持 |

### `.github/workflows/` — GitHub Actions CI/CD

| 項目 | 内容 |
|------|------|
| **役割** | PR 品質ゲートと main ブランチからの本番デプロイを GitHub Actions で自動化 |
| **ファイルパターン** | `*.yml` |
| **ファイル構成** | `ci.yml`（PR 時の検証）、`deploy.yml`（main push 時の OIDC デプロイ + CloudFront invalidation） |
| **認証方式** | AWS OIDC フェデレーション（`aws-actions/configure-aws-credentials@v5`）。アクセスキー不使用 |
| **依存先** | `cc_aws_portfolio` リポジトリで Terraform 管理される IAM ロール・S3 バケット・CloudFront Distribution |
| **設定値** | Repository Secrets（`AWS_ROLE_ARN`, `S3_BUCKET_NAME`, `CLOUDFRONT_DISTRIBUTION_ID`）と Repository Variables（`AWS_REGION`）で注入 |

## 命名規則

### ディレクトリ

| 種別 | 規則 | 例 |
|------|------|------|
| ページルート | kebab-case（Next.js規約） | `about/`, `projects/` |
| コンポーネントグループ | kebab-case | `layout/`, `home/`, `ui/` |
| データ | kebab-case | `data/`, `types/` |
| フック | kebab-case | `hooks/` |

### ファイル

| 種別 | 規則 | 例 |
|------|------|------|
| Reactコンポーネント | PascalCase + `.tsx` | `ProjectCard.tsx`, `Header.tsx` |
| データファイル | camelCase + `.ts` | `skills.ts`, `projects.ts` |
| カスタムフック | `use` プレフィックス + camelCase + `.ts` | `useActiveNav.ts` |
| 型定義 | camelCase + `.ts` | `index.ts` |
| 設定ファイル | プロジェクト規約に準拠 | `next.config.js`, `tailwind.config.ts` |
| テスト | 対象名 + `.test.tsx`/`.test.ts` | `Header.test.tsx` |
| ドキュメント | kebab-case + `.md` | `product-requirements.md` |

### コード内の命名

| 種別 | 規則 | 例 |
|------|------|------|
| 型・インターフェース | PascalCase | `Project`, `BlogPost`, `SkillCategory` |
| コンポーネント | PascalCase | `ProjectCard`, `HeroSection` |
| 関数 | camelCase | `getFormattedDate` |
| 定数 | UPPER_SNAKE_CASE | `SITE_URL`, `MAX_PROJECTS` |
| Props型 | PascalCase + `Props` | `ProjectCardProps`, `BadgeProps` |
| データ配列 | camelCase（複数形） | `skills`, `projects`, `careers` |

## 依存関係ルール

### レイヤー依存の方向

```
app/page.tsx（ページ）
    │
    ├──→ components/*（セクション・UIパーツ）
    ├──→ data/*（コンテンツデータ）
    ├──→ hooks/*（カスタムフック）
    └──→ types/*（型定義）

components/*（セクション）
    │
    ├──→ components/ui/*（汎用UIパーツ）
    ├──→ hooks/*（カスタムフック）
    └──→ types/*（型定義）

components/ui/*（汎用UIパーツ）
    │
    ├──→ hooks/*（カスタムフック）
    └──→ types/*（型定義）

hooks/*（カスタムフック）
    │
    └──→ types/*（型定義）

data/*（データ）
    │
    └──→ types/*（型定義）
```

### 禁止される依存

| from | to | 理由 |
|------|----|------|
| `components/ui/` | `components/home/` 等 | 汎用パーツがページ固有コンポーネントに依存すると再利用不能 |
| `components/*` | `data/*` | コンポーネントはPropsでデータを受け取る。直接importしない |
| `data/*` | `components/*` | データ層はUI層に依存しない |
| `hooks/*` | `components/*`, `data/*` | フックはUIやコンテンツに依存しない。純粋なロジック層 |
| `types/` | 他すべて | 型定義は最下層。依存を持たない |

**例外**: `app/page.tsx` は `data/*` を直接importしてコンポーネントにPropsとして渡す。これはページレイヤーの責務。

## ファイル配置ルール

### 新しいページを追加する場合

1. `src/app/[route]/page.tsx` を作成
2. ページ専用コンポーネントがあれば `src/components/[route]/` に配置
3. 新しいデータが必要なら `src/data/[name].ts` と `src/types/index.ts` を更新
4. テストは `__tests__/components/[route]/` に配置

### 新しいコンポーネントを追加する場合

| 条件 | 配置先 |
|------|--------|
| 1ページでのみ使用 | `src/components/[page-name]/` |
| 2ページ以上で使用 | `src/components/ui/` |
| レイアウト要素（全ページ共通） | `src/components/layout/` |

### ファイルサイズの目安

- コンポーネント: 200行以下を推奨。超える場合はサブコンポーネントに分割
- データファイル: コンテンツ量に応じて自然に増加。制限なし
- ページ: 100行以下を推奨。ロジックはコンポーネントに委譲

## スケーリング戦略

### コンポーネント分割の判断基準

以下の条件に該当する場合、コンポーネントを分割する:

1. **200行超**: ファイルが大きくなりすぎた
2. **複数責務**: 1コンポーネントが2つ以上の独立した機能を持つ
3. **再利用**: 同じUIパターンが2箇所以上に出現
4. **テスト困難**: コンポーネント単体でのテストが書きにくい

### Post-MVPでの拡張パターン

| 機能追加 | 影響するディレクトリ | 変更内容 |
|---------|-------------------|---------|
| Framer Motion (P1) | `components/` 全般 | アニメーションラッパー追加。`components/ui/AnimateOnScroll.tsx` 等 |
| ダークモード (P2) | `app/layout.tsx`, `components/layout/` | テーマ切替ボタン追加。Tailwind `dark:` バリアント適用 |
| i18n (P2) | `app/`, `data/` | `app/[locale]/` 構造に変更。データファイルの多言語対応 |
| OGP画像生成 (P2) | `scripts/` | ビルドスクリプト追加 |

## 除外設定

### `.gitignore`

```gitignore
# Dependencies
node_modules/

# Build output
out/
.next/

# Environment
.env
.env.local

# IDE
.vscode/
*.swp

# OS
.DS_Store
Thumbs.db

# Debug
npm-debug.log*
```

### `.prettierignore`

```
out/
.next/
node_modules/
package-lock.json
```

### `.eslintignore`

```
out/
.next/
node_modules/
```

## ルートレベルファイル一覧

| ファイル | 用途 | 編集頻度 |
|---------|------|---------|
| `CLAUDE.md` | Claude Codeプロジェクト設定 | 低（方針変更時のみ） |
| `DESIGN.md` | デザインシステム定義 | 低（デザイン変更時のみ） |
| `next.config.js` | Next.js設定（Static Export等） | 低 |
| `tailwind.config.ts` | Tailwind CSSカスタマイズ | 低（DESIGN.mdトークン反映） |
| `tsconfig.json` | TypeScript設定 | 低 |
| `postcss.config.js` | PostCSS設定 | ほぼ変更なし |
| `package.json` | 依存関係・スクリプト | 中（依存追加時） |
| `package-lock.json` | 依存関係ロック | 自動更新 |
| `.eslintrc.json` | ESLint設定 | 低 |
| `.prettierrc` | Prettier設定 | 低 |
| `.gitignore` | Git除外設定 | 低 |
