# 要求定義: 共通レイアウト（Header・Footer・Navigation）

## 対象PRD要件

PRD F6: 共通レイアウト

## 要求内容

全ページ共通のHeader・Footer・Navigationコンポーネントを実装し、App Routerの`layout.tsx`で統合する。

### 前提条件

- **プロジェクト未初期化**: `package.json`、`src/`、設定ファイルがまだ存在しない
- **プロジェクトスキャフォールドが必須**: Next.js + TypeScript + Tailwind CSSの初期セットアップを含む

### 受け入れ条件（PRD F6準拠）

- [ ] 全ページ共通のHeaderコンポーネント（ナビゲーションリンク付き）がある
- [ ] 全ページ共通のFooterコンポーネント（コピーライト・SNSリンク）がある
- [ ] 現在のページがナビゲーション上でハイライトされる
- [ ] モバイルではハンバーガーメニューのスライドインナビゲーションが表示される
- [ ] App Routerの`layout.tsx`で共通レイアウトを実装する

### 追加要件（機能設計書・開発ガイドライン準拠）

- [ ] DESIGN.mdのデザイントークンに完全準拠
- [ ] `tailwind.config.ts`にDESIGN.mdトークンを反映
- [ ] Geist Sans / Geist Monoフォントを`next/font/google`で設定
- [ ] セマンティックHTML: `<header>`, `<nav>`, `<main>`, `<footer>`ランドマーク要素を使用
- [ ] アクセシビリティ: フォーカスリング、キーボード操作、フォーカストラップ（モバイルメニュー）
- [ ] `next.config.js`にStatic Export設定（`output: 'export'`, `trailingSlash: true`, `images.unoptimized: true`）
- [ ] named exportのみ使用（default export禁止、ただしApp Router規約のpage/layoutは除く）
- [ ] TypeScript strict mode
- [ ] ESLint + Prettier設定

### スコープ外

- 各ページの実体コンテンツ実装（スタブのみ作成）
- Education型・education.tsデータファイル（Aboutページ実装時に作成）
- Framer Motionアニメーション（Post-MVP P1）
- ダークモード対応（Post-MVP P2）
- CI/CDパイプライン設定（別タスク）
