# 設計書: 共通レイアウト（Header・Footer・Navigation）

## 実装アプローチ

### 1. プロジェクト初期化

プロジェクトが未初期化のため、手動セットアップを行う（`create-next-app`は不使用、設定を完全制御するため）。

**依存パッケージ**:
- `next@14` — App Router + Static Export
- `react@18`, `react-dom@18`
- `typescript@5`
- `tailwindcss@3`, `postcss`, `autoprefixer`
- `lucide-react` — アイコンライブラリ
- `@types/react`, `@types/react-dom`, `@types/node`
- `eslint@8`, `eslint-config-next@14` — ESLint 8.x系（`eslint-config-next@14`はESLint 8.xを前提）
- `prettier`, `prettier-plugin-tailwindcss`
- `jest`, `@testing-library/react`, `@testing-library/jest-dom`, `ts-jest`, `jest-environment-jsdom`

### 2. 設定ファイル

#### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};
module.exports = nextConfig;
```

#### tailwind.config.ts — DESIGN.mdトークン反映
- colors: vercel-black, pure-white, ship-red, preview-pink, develop-blue, link-blue, focus-blue, gray scale (50-900)
- fontFamily: geist-sans (CSS variable), geist-mono (CSS variable)
- fontSize: DESIGN.mdの13ロール全て定義
- borderRadius: micro(2px), subtle(4px), standard(6px), comfortable(8px), image(12px), large(64px), xl(100px), pill(9999px)
- boxShadow: ring, light-ring, subtle-card, full-card, focus
- spacing: DESIGN.mdの8px基準スケール
- screens: sm:640px, md:768px, lg:1024px, xl:1280px (Tailwind defaults + DESIGN.md breakpoints対応)

#### tsconfig.json
- `strict: true`
- `paths`: `@/*` → `./src/*`

### 3. コンポーネント設計

#### layout.tsx（ルートレイアウト）
- Geist Sans / Geist Monoを`next/font/google`でロード、CSS variable方式でTailwindに連携
- `<html lang="ja">` + フォントCSS変数をclassNameに付与
- `<body>`: Header → `<main>` → Footer の構成
- メタデータ: `metadata` export でサイト全体のデフォルトtitle/description/OGP設定

#### Header.tsx
- `'use client'` — `usePathname()`とモバイルメニュー開閉stateのため
- sticky配置（`position: sticky; top: 0; z-index: 50`）
- 背景: white + shadow-as-border (下部)
- コンテンツ: サイト名（左）+ ナビリンク（中央/右）+ ハンバーガー（モバイルのみ）
- ナビリンク: Home(/), About(/about), Projects(/projects), Blog(/blog), Contact(/contact)
- アクティブ判定: `usePathname()` で現在パスと比較
- アクティブスタイル: `font-weight: 600` + アンダーライン（`text-decoration: underline`, `text-underline-offset: 4px`）（通常は weight 500、アンダーラインなし）
- デスクトップ: `md:`以上で水平リンク表示
- モバイル: `md:`未満でハンバーガーアイコン表示

#### Navigation.tsx（モバイルメニュー）
- `'use client'`
- Props: `{ isOpen: boolean; onClose: () => void }`
- 右側スライドイン: `transform: translateX(100%)` → `translateX(0)`
- オーバーレイ: `rgba(0,0,0,0.4)`全画面
- メニュー幅: `w-3/4 max-w-[300px]`
- 閉じる条件4つ: ×ボタン、オーバーレイ、リンククリック、Escapeキー
- アニメーション: `transition: transform 200ms ease-out`
- フォーカストラップ: メニュー開放時に最初のリンクにフォーカス、Tab循環
- `aria-label="ナビゲーションメニュー"`
- body scroll lock: useEffect内で`document.body.style.overflow = 'hidden'`を設定（`typeof window !== 'undefined'`ガード付き）

#### Footer.tsx
- コピーライト: `© {currentYear} {author.name}`（年は動的計算）
- SNSアイコンリンク: `socialLinks`データから生成
- lucide-reactアイコン: `DynamicIcon`で動的にアイコン名→コンポーネント
- 外部リンク: `target="_blank"` + `rel="noopener noreferrer"`
- デザイン: 上部shadow-as-border、テキストGray 500

### 4. データ・型定義

この機能で必要な最小限のデータと型:

#### src/types/index.ts
- `SiteMetadata`, `Strength`, `SocialLink` インターフェース（機能設計書準拠）

#### src/data/metadata.ts
- サイト名、著者名、タグライン、OGP設定のプレースホルダー

#### src/data/social.ts
- SNSリンクデータ（GitHub, X等）のプレースホルダー

### 5. ページスタブ

ビルド成功のために全5ページ + not-foundのスタブを作成:
- `src/app/page.tsx` — トップページ
- `src/app/about/page.tsx`
- `src/app/projects/page.tsx`
- `src/app/blog/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/not-found.tsx`

各スタブはページ名を表示するだけの最小実装。

### 6. テスト

- `__tests__/components/layout/Header.test.tsx` — ナビリンク存在、アクティブ状態
- `__tests__/components/layout/Footer.test.tsx` — コピーライト、SNSリンク
- Jest + React Testing Library + jest-environment-jsdom

### 7. 技術的判断

| 判断 | 選択 | 理由 |
|------|------|------|
| create-next-app使用 | 不使用 | 設定の完全制御、不要ファイル回避 |
| Geistフォント読み込み | `next/font/google` + CSS variable | Tailwind連携のためCSS variable方式が必須 |
| lucide-reactアイコン | DynamicIcon | データ駆動でアイコン名を指定する設計に適合 |
| Next.jsバージョン | 14.0.3+ | PRD・機能設計書の指定に準拠。Geist Font同梱はv14.0.3以降 |
| ESLintバージョン | 8.x | `eslint-config-next@14`はESLint 8.xを前提。architecture.mdの9.x記載は要更新 |
| Tailwind CSSバージョン | 3.x | PRD指定。v4はまだ安定版でない |
| モバイルメニューアニメーション | CSS transition | MVP段階。Framer MotionはPost-MVP |
| フォーカストラップ | 手動実装 | 外部ライブラリ依存を最小化 |
