# ポートフォリオサイト総合改善プラン

## Context

MVPが完成したポートフォリオサイトに対し、コンテンツの深化（C1/C2/C3）とUI/UX改善（U1/U2/U4/U5）の7項目を実装する。変更は5フェーズに分かれ、基盤的な変更（ダークモード）を先に行い、その上にインタラクション統一・コンテンツ・サムネイルを積む順序で進める。

---

## Phase 1: ダークモード基盤（U4）

全コンポーネントに影響するため最初に実装。CSS変数スワップ方式により既存コンポーネントの変更を最小限に抑える。

### 1-1. next-themes インストール

```bash
npm install next-themes
```

### 1-2. globals.css にダークモード定義追加

**File: `src/app/globals.css`**

`@theme` ブロックの後に追加:
- `@custom-variant dark (&:is(.dark *));`
- `:root { color-scheme: light; }`
- `.dark { ... }` で全カラー・シャドウトークンをダーク値に再定義
- `.dark .hero-gradient { ... }` でヒーログラデーションのダーク版

**主なカラーマッピング:**

| Token | Light | Dark |
|-------|-------|------|
| pure-white | #ffffff | #0a0a0a |
| vercel-black | #171717 | #ededed |
| gray-50 | #fafafa | #1a1a1a |
| gray-100 | #ebebeb | #2a2a2a |
| gray-500 | #666666 | #999999 |
| gray-600 | #4d4d4d | #b0b0b0 |
| link-blue | #0072f5 | #4da3ff |
| badge-\*-bg | 不透明色 | rgba(..., 0.15) 半透明 |
| shadow-\* | rgba(0,0,0,...) | rgba(255,255,255,...) |

**設計根拠:** 既存コンポーネントは `bg-pure-white`, `text-vercel-black` 等のトークンクラスを使用。CSS変数をスワップするだけで自動的にダークモード対応。個別コンポーネントへの `dark:` クラス追加は不要。

### 1-3. ThemeProvider 作成

**新規: `src/components/providers/ThemeProvider.tsx`**
- `'use client'` コンポーネント
- `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`

### 1-4. layout.tsx に統合

**File: `src/app/layout.tsx`**
- `<html>` に `suppressHydrationWarning` 追加
- `<body>` 内を `<ThemeProvider>` でラップ

### 1-5. ThemeToggle コンポーネント作成

**新規: `src/components/ui/ThemeToggle.tsx`**
- `'use client'`, `useTheme` フック使用
- system → light → dark サイクル
- Lucide アイコン: `Monitor`, `Sun`, `Moon`
- マウント前はサイズ固定プレースホルダー（レイアウトシフト防止）
- 既存 Header のアイコンボタンスタイルに統一: `rounded-circle p-8 focus-visible:shadow-focus`

### 1-6. Header に ThemeToggle 配置

**File: `src/components/layout/Header.tsx`**
- デスクトップ nav とハンバーガーの間に配置
- 全画面サイズで常時表示

---

## Phase 2: インタラクション統一 + トークン準備（U2 + U1）

### 2-1. インタラクション統一（U2）

**統一パターン:**

| 要素 | 変更前 | 変更後 |
|------|--------|--------|
| Primary button | `transition-opacity hover:opacity-85` | `transition-all duration-200 hover:opacity-85 active:scale-[0.98]` |
| Secondary button | `transition-shadow hover:shadow-ring` | `transition-all duration-200 hover:shadow-ring active:scale-[0.98]` |
| 全カード | `transition hover:...` | `transition-all duration-200 hover:...` |
| ハンバーガー | なし | `active:scale-95` 追加 |
| Footer アイコン | `transition-colors` | `transition-all duration-200 active:scale-95` |

**変更対象ファイル:**
- `src/components/home/HeroSection.tsx` — ボタン2箇所 + テキスト変更（C2: "Side Projects を見る"）
- `src/components/projects/ProjectCard.tsx` — `transition` → `transition-all duration-200`
- `src/components/blog/BlogCard.tsx` — 同上
- `src/components/home/StrengthCard.tsx` — 同上
- `src/components/contact/SocialLinkCard.tsx` — 同上
- `src/components/layout/Header.tsx` — SheetTrigger に `active:scale-95`（Phase 1と同時）
- `src/components/layout/Footer.tsx` — ソーシャルアイコンに `active:scale-95`

### 2-2. U1 トークン活用計画

トークンは Phase 3/4 の新規コンテンツで自然に使用。無理に既存コンポーネントに押し込まない:

| トークン | 使用箇所 | Phase |
|---------|---------|-------|
| `text-sub-heading` (32px, wt400) | About イントロ見出し | Phase 3 (C1) |
| `text-sub-heading-large` (32px, wt600) | Contact CTA 見出し, メトリクス値 | Phase 3 (C2, C3) |
| `rounded-image` (12px) | サムネイル, Contact CTA カード | Phase 3 (C3), Phase 4 (U5) |
| `text-gray-400` | メトリクスラベル, Contact 補足テキスト | Phase 3 (C2, C3) |
| `text-button-small` (14px, wt400) | Contact 補足テキスト | Phase 3 (C3) |

---

## Phase 3: コンテンツ改善（C1 + C2 + C3）

### 3-1. 型拡張 — `src/types/index.ts`

**SiteMetadata.author に追加:**
```typescript
introduction: string;
```

**Project に追加:**
```typescript
metrics?: { label: string; value: string }[];
linkLabel?: string;
```

### 3-2. C1: About ページにイントロ文追加

**データ — `src/data/metadata.ts`:**
```typescript
introduction: 'マルチクラウド（AWS / Google Cloud）環境での IaC 設計・構築・運用を軸に、AI 駆動開発の導入推進やパフォーマンス改善・コスト最適化に取り組む SRE エンジニアです。技術書の共著やコミュニティ運営を通じた技術発信にも力を入れています。',
```
※ レジュメ facts に基づく。会社名・具体的数値は含めない（CLAUDE.md ルール準拠）。

**ページ — `src/app/about/page.tsx`:**
- ページヘッダーと Career セクションの間にイントロセクションを挿入
- `text-sub-heading` (U1: 32px, wt400) で見出し "Introduction"
- `text-body-large text-gray-600` で紹介文
- `siteMetadata` をインポートして表示

### 3-3. C2: "Projects" → "Side Projects" + プロジェクト追加 + メトリクス

**ナビ — `src/data/navigation.ts`:**
- `Projects` → `Side Projects`

**データ — `src/data/projects.ts`:**
- 既存 TiUG に `metrics`, `linkLabel: 'Connpass'` 追加
- 新規3件:
  1. **AWS認定資格対策本 共著** — metrics: `[{共著者数, '70'}, {ダウンロード数, '16,500'}]`
  2. **AWS Amplify ハンズオン本 編集**
  3. **JAWS / 生成AI 勉強会**

**ProjectCard — `src/components/projects/ProjectCard.tsx`:**
- props に `metrics`, `linkLabel` 追加
- メトリクス表示: `text-sub-heading-large` (U1) で値、`text-caption text-gray-400` (U1) でラベル
- liveUrl リンクテキスト: ハードコード `Connpass` → `linkLabel ?? 'Live'`

**ページ — `src/app/projects/page.tsx`:**
- h1: `Projects` → `Side Projects`
- サブタイトル: `公開プロジェクト一覧` → `個人開発・技術書・コミュニティ活動`
- ProjectCard に新 props を渡す

**HeroSection — `src/components/home/HeroSection.tsx`:**
- `Projects を見る` → `Side Projects を見る`

### 3-4. C3: Contact ページ強化

**ページ — `src/app/contact/page.tsx`:**
- ページヘッダーとリンク一覧の間に CTA セクション挿入:
  - `rounded-image` (U1: 12px) カード
  - `text-sub-heading-large` (U1) で「お気軽にご連絡ください」
  - 説明文（SRE・クラウド・AI関連のご相談、コミュニティコラボ等）
  - Primary CTA: メール送信ボタン（`bg-vercel-black` + U2 パターン）
  - Secondary CTA: LinkedIn リンク
  - `text-button-small text-gray-400` (U1) で補足テキスト

---

## Phase 4: プロジェクトサムネイル（U5）

### 4-1. 型定義 — `src/types/index.ts`

```typescript
export type ProjectAccentColor = 'ship' | 'preview' | 'develop';

export interface ProjectThumbnail {
  accentColor: ProjectAccentColor;
  icon: string; // Lucide icon name
}
```

Project 型に `thumbnail?: ProjectThumbnail` 追加。

### 4-2. サムネイルデータ — `src/data/projects.ts`

| Project | accentColor | icon |
|---------|-------------|------|
| Portfolio Site | develop (blue) | Globe |
| Portfolio Infra | ship (red) | Cloud |
| TiUG | preview (pink) | Users |
| AWS認定資格本 | ship (red) | BookOpen |
| Amplify本 | develop (blue) | PenTool |
| JAWS/生成AI | preview (pink) | Presentation |

### 4-3. ProjectThumbnail コンポーネント作成

**新規: `src/components/projects/ProjectThumbnail.tsx`**
- accentColor のグラデーション背景 (`bg-gradient-to-br from-{color}/20 to-{color}/5`)
- Lucide アイコン (48px, 60% opacity) 中央配置
- `rounded-image` (12px — U1 トークン活用)
- 高さ 180px 固定、`aria-hidden="true"`
- ダークモード自動対応（CSS変数スワップ経由）

### 4-4. ProjectCard にサムネイル統合

**File: `src/components/projects/ProjectCard.tsx`**
- `thumbnail` prop 追加
- `overflow-hidden` を article に追加
- サムネイルは負マージン (`-mx-32 -mt-32`) でカード上部にフルブリード
- タイトルの上に配置

### 4-5. projects/page.tsx から thumbnail prop を渡す

---

## Phase 5: テスト・検証

### テスト更新

- `__tests__/components/projects/ProjectCard.test.tsx` — metrics, thumbnail, linkLabel テスト追加
- `__tests__/components/ui/ThemeToggle.test.tsx` — 新規（next-themes mock）
- 既存テストの動作確認（Optional props なので破壊的変更なし）

### 検証手順

1. `npm run typecheck` — 型エラーなし
2. `npm run lint` — Biome lint パス
3. `npm run test` — 全テストパス
4. `npm run build` — static export ビルド成功
5. `npm run dev` → ブラウザで以下を確認:
   - ダークモード切替（3モード: system/light/dark）
   - About ページのイントロ表示
   - Side Projects ページ（6件・サムネイル・メトリクス）
   - Contact ページ CTA 表示
   - 全カード・ボタンのホバー/アクティブ状態
   - モバイル表示

---

## 変更ファイル一覧

| Phase | File | 変更内容 |
|-------|------|---------|
| 1 | `package.json` | next-themes 追加 |
| 1 | `src/app/globals.css` | dark variant, .dark 変数, hero gradient dark |
| 1 | `src/components/providers/ThemeProvider.tsx` | **新規** |
| 1 | `src/app/layout.tsx` | ThemeProvider 統合, suppressHydrationWarning |
| 1 | `src/components/ui/ThemeToggle.tsx` | **新規** |
| 1 | `src/components/layout/Header.tsx` | ThemeToggle 配置 + active:scale-95 |
| 2 | `src/components/home/HeroSection.tsx` | active:scale, duration-200, ボタンテキスト |
| 2 | `src/components/projects/ProjectCard.tsx` | duration-200 |
| 2 | `src/components/blog/BlogCard.tsx` | duration-200 |
| 2 | `src/components/home/StrengthCard.tsx` | duration-200 |
| 2 | `src/components/contact/SocialLinkCard.tsx` | duration-200 |
| 2 | `src/components/layout/Footer.tsx` | active:scale-95 |
| 3 | `src/types/index.ts` | introduction, metrics, linkLabel 追加 |
| 3 | `src/data/metadata.ts` | introduction フィールド |
| 3 | `src/data/navigation.ts` | "Side Projects" |
| 3 | `src/data/projects.ts` | 新規3件 + metrics + linkLabel |
| 3 | `src/app/about/page.tsx` | イントロセクション |
| 3 | `src/app/projects/page.tsx` | タイトル変更 + 新 props |
| 3 | `src/app/contact/page.tsx` | CTA セクション |
| 3 | `src/components/projects/ProjectCard.tsx` | metrics + linkLabel 表示 |
| 4 | `src/types/index.ts` | ProjectThumbnail 型 |
| 4 | `src/data/projects.ts` | thumbnail データ |
| 4 | `src/components/projects/ProjectThumbnail.tsx` | **新規** |
| 4 | `src/components/projects/ProjectCard.tsx` | thumbnail 統合 |
| 4 | `src/app/projects/page.tsx` | thumbnail prop 追加 |
| 5 | `__tests__/` | テスト更新・追加 |

---

## DESIGN.md 更新

ダークモード対応に伴い、DESIGN.md にダークモードカラーパレットセクションを追加する。

---

## /add-feature コマンド一覧

以下の順序で `/add-feature` を実行することで、フェーズごとに段階的に実装できる。各コマンドは前のフェーズが完了していることを前提とする。詳細仕様はすべて本ドキュメント (`docs/ideas/portfolio-enhancement-plan.md`) を参照のこと。

```
/add-feature docs/ideas/portfolio-enhancement-plan.md の Phase 1 に従い、ダークモード対応を実装（next-themes + CSS変数スワップ + ThemeToggle）(U4)

/add-feature docs/ideas/portfolio-enhancement-plan.md の Phase 2 に従い、インタラクション統一を実装（全カード・ボタンに duration-200 と active:scale を追加）(U2)

/add-feature docs/ideas/portfolio-enhancement-plan.md の Phase 3-C1 に従い、Aboutページにイントロ文を追加（siteMetadata.author.introduction + text-sub-heading トークン活用）

/add-feature docs/ideas/portfolio-enhancement-plan.md の Phase 3-C2 に従い、Side Projectsリネーム + プロジェクト3件追加 + インパクトメトリクス表示を実装

/add-feature docs/ideas/portfolio-enhancement-plan.md の Phase 3-C3 に従い、Contactページを強化（CTAセクション + メール/LinkedInボタン + 補足テキスト）

/add-feature docs/ideas/portfolio-enhancement-plan.md の Phase 4 に従い、プロジェクトカードにサムネイルプレースホルダーを実装（グラデーション + Lucideアイコン）(U5)

/add-feature docs/ideas/portfolio-enhancement-plan.md の Phase 5 に従い、テストを更新（ProjectCard・ThemeToggle テスト追加 + 既存テスト修正）
```

**補足:**
- Phase 3 の C1/C2/C3 は独立性が高いため個別に実行可能だが、C2 の型拡張（`metrics`, `linkLabel`）は先に行う必要がある
- U1（トークン活用）は独立したフェーズではなく、C1/C2/C3/U5 の各実装に組み込まれる
- 各フェーズ完了後に `npm run typecheck && npm run lint && npm run test && npm run build` で検証すること
