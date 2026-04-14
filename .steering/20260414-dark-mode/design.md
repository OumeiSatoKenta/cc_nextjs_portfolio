# 設計: ダークモード対応 (U4)

## アーキテクチャ方針

CSS カスタムプロパティ（変数）のスワップ方式を採用する。

```
Light: --color-pure-white: #ffffff → bg-pure-white → background-color: #ffffff
Dark:  --color-pure-white: #0a0a0a → bg-pure-white → background-color: #0a0a0a
```

既存コンポーネントは `bg-pure-white`, `text-vercel-black` 等のトークンクラスを使用しているため、`.dark` セレクタで CSS 変数を再定義するだけで全コンポーネントが自動的にダークモード対応になる。

## 変更ファイル一覧

| ファイル | 種別 | 変更内容 |
|---------|------|---------|
| `package.json` | 修正 | next-themes 依存追加 |
| `src/app/globals.css` | 修正 | @custom-variant, .dark 変数, hero gradient dark, color-scheme |
| `src/components/providers/ThemeProvider.tsx` | **新規** | next-themes ラッパー |
| `src/app/layout.tsx` | 修正 | ThemeProvider 統合, suppressHydrationWarning |
| `src/components/ui/ThemeToggle.tsx` | **新規** | テーマ切替ボタン |
| `src/components/layout/Header.tsx` | 修正 | ThemeToggle 配置 |

## ダークモードカラーマッピング

### 基本カラー

| Token | Light | Dark | 根拠 |
|-------|-------|------|------|
| `--color-pure-white` | #ffffff | #0a0a0a | 真っ黒ではなく微暖色で目に優しい |
| `--color-vercel-black` | #171717 | #ededed | ライトテキスト |
| `--color-true-black` | #000000 | #ffffff | コンソール用反転 |
| `--color-gray-50` | #fafafa | #1a1a1a | 最暗ニュートラルサーフェス |
| `--color-gray-100` | #ebebeb | #2a2a2a | ボーダー・ディバイダー |
| `--color-gray-400` | #808080 | #808080 | 中間点のため変更なし |
| `--color-gray-500` | #666666 | #999999 | ミュートテキスト |
| `--color-gray-600` | #4d4d4d | #b0b0b0 | ボディテキスト |
| `--color-gray-900` | #171717 | #ededed | 見出し |

### アクセントカラー（暗い背景で視認性向上のため微調整）

| Token | Light | Dark |
|-------|-------|------|
| `--color-ship-red` | #ff5b4f | #ff6f64 |
| `--color-preview-pink` | #de1d8d | #e84da5 |
| `--color-develop-blue` | #0a72ef | #3d8ef5 |
| `--color-link-blue` | #0072f5 | #4da3ff |
| `--color-focus-blue` | hsla(212,100%,48%,1) | hsla(212,100%,60%,1) |

### バッジカラー（不透明 → 半透明で暗い背景に馴染む）

| Token | Light | Dark |
|-------|-------|------|
| `--color-badge-blue-bg` | #ebf5ff | rgba(10,114,239,0.15) |
| `--color-badge-blue-text` | #0068d6 | #6db3ff |
| `--color-badge-cloud-bg` | #ebf5ff | rgba(0,82,204,0.15) |
| `--color-badge-cloud-text` | #0052cc | #6da3ff |
| `--color-badge-lang-bg` | #fdf2f8 | rgba(179,20,114,0.15) |
| `--color-badge-lang-text` | #b31472 | #e85aac |
| `--color-badge-db-bg` | #fff5f5 | rgba(184,48,40,0.15) |
| `--color-badge-db-text` | #b83028 | #f07068 |
| `--color-badge-tool-bg` | #f5f5f5 | rgba(255,255,255,0.08) |
| `--color-badge-tool-text` | #4d4d4d | #b0b0b0 |

### シャドウ（黒ベース → 白ベースに反転）

| Token | Dark |
|-------|------|
| `--shadow-ring` | rgba(255,255,255,0.1) 0px 0px 0px 1px |
| `--shadow-light-ring` | rgba(255,255,255,0.12) 0px 0px 0px 1px |
| `--shadow-subtle-card` | rgba(255,255,255,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.3) 0px 2px 2px |
| `--shadow-full-card` | rgba(255,255,255,0.1) 0px 0px 0px 1px, rgba(0,0,0,0.4) 0px 2px 2px, rgba(0,0,0,0.3) 0px 8px 8px -8px |
| `--shadow-focus` | 0 0 0 2px hsla(212,100%,60%,1) |

## コンポーネント設計

### ThemeProvider (`src/components/providers/ThemeProvider.tsx`)

- `'use client'` コンポーネント
- `attribute="class"`: `.dark` クラスを `<html>` に付与
- `defaultTheme="system"`: OS設定に追従
- `enableSystem`: system テーマをサポート
- `disableTransitionOnChange`: テーマ切替時のトランジションフラッシュを防止

### ThemeToggle (`src/components/ui/ThemeToggle.tsx`)

- `useTheme()` で現在のテーマ取得 + 切替
- サイクル: system → light → dark → system
- マウント前: `<div className="size-36" />` プレースホルダー
- マウント後: テーマに応じた Lucide アイコンを表示
- スタイル: 既存 Header のアイコンボタン (`rounded-circle p-8 focus-visible:shadow-focus`) に統一

### Header 統合

- デスクトップ: `<nav>` と `<Sheet>` の間に `<ThemeToggle />` 配置
- `<div className="flex items-center gap-8">` でトグルとハンバーガーをグルーピング
