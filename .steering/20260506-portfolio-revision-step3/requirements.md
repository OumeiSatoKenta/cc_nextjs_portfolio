# Step 3: About ページ強化 — 要件定義

## 目的

About ページ (`/about`) を「ページ内ナビ＋セクションリズム＋学歴詳細＋人物像＋次への動線」を備えた充実ページに変える。Step 2 でトップページが Hub になったので、ハブから流入したユーザーが About ページ内でも迷わずに目的の情報へ辿れるようにする。

参照: `docs/ideas/portfolio-revision-plan.md` (Step 3 範囲のみ)

## 前提

- Step 1, 2 完了済み（イントロ書き直し、ナビ日本語化、トップページ Hub 化）。
- 学術写真 `public/images/projects/collider_experiment_image.png` / `cosmic_ray_air_shower.png` 配置済み。
- `docs/20260505_適正試験結果` (PDF) からパーソナル情報を構造化（PR 表示レベルに留める）。
- 既存テスト 181 件 PASS。

## 機能要件

### F1. ページ内スティッキーナビ (StickyNav)

- About ページ上部、Hero 直下に配置。
- セクションアンカーリンク 5 件: イントロ / キャリア / スキル / 学歴 / パーソナル
- スクロール時にヘッダー (`sticky top-0 z-50`) の下に追従（`sticky top-[calc(header-height)] z-40`）。
- 現在のスクロール位置に応じてアクティブセクションをハイライト（`useSectionObserver` フック使用）。
- 初期表示時（スクロール未実施でページトップ）: 最初のセクション（イントロ）をアクティブとして表示。
- アンカーリンク `<a href="#intro">` 等で `id` 付きセクションへスムーズスクロール（CSS `scroll-behavior: smooth` を `prefers-reduced-motion` 配慮で適用）。
- モバイル: 横スクロール可能なバッジ列。

### F2. セクション交互背景色

各セクションに以下の `id` と背景色を適用:

| ID | セクション | 背景色 |
| --- | --- | --- |
| `intro` | イントロダクション | `bg-pure-white` |
| `career` | キャリア | `bg-gray-50` |
| `skills` | スキル | `bg-pure-white` |
| `education` | 学歴・資格 | `bg-gray-50` |
| `personal` | パーソナル情報 | `bg-pure-white` |

### F3. 学歴アコーディオン (EducationAccordion)

- 既存の `educations` 配列をアコーディオン UI に変換。
- `details` または `images` を持つカードのみ開閉可能。両方持たないカードは静的表示（インタラクティブ要素なし、フォーカス停止しない `<div>` で実装）。
- 展開可能なカードはクリック / Enter / Space で開閉。複数同時展開を許容（学歴・論文を並べて見るユースケースに対応）。
- 展開時:
  - 既存 `description`
  - 新規 `details` テキスト（より詳細な研究内容）
  - 新規 `images` (collider / airshower 写真、キャプション付き)
- アクセシビリティ: `aria-expanded`, `aria-controls`, `<button>` 使用。
- アニメーション: CSS `grid-template-rows: 0fr → 1fr` トランジション。

### F4. パーソナル情報セクション (PersonalInfoSection)

`docs/20260505_適正試験結果` から抽出した内容を構造化して表示:

- **資質タイプ**: 「専門家 × エクスパンダー」(タイトル + 一文の概要)
- **上位 3 つの資質**: 論理 / 着実 / 規律 (タイトル + 説明)
- **自己認識**: 強みと意識的に取り組んでいる成長領域 (3 件程度の箇条書き)

**プライバシー配慮 (CLAUDE.md ルール)**:
- 給与志向・ワークバランス指標などの個人的志向は表示しない。
- 「PR / 職務要約レベル」に留める（仕事における強み・志向のみ）。

### F5. NextReadNav (フッター誘導)

- About ページ最下部に配置。
- 2-3 枚の誘導カード:
  - サイドプロジェクトを見る → `/projects/`
  - ブログを読む → `/blog/`
  - お問い合わせ → `/contact/`
- `SectionPreview` のリンクパターンに揃えつつ、より大きめのカード UI（タイトル + 一文 + アイコン or 矢印）。

## 非機能要件

### NF1. 既存パターン準拠

- レイアウト: 既存 `mx-auto max-w-[1200px] px-16 md:px-32` を踏襲。
- 見出し: `text-section-heading text-vercel-black`。
- カード: `rounded-comfortable bg-pure-white p-32 shadow-subtle-card`。
- バッジ: `rounded-pill bg-badge-*-bg text-badge-*-text px-10 py-3 text-caption`。
- 各セクションは `<AnimateOnScroll>` でラップ。

### NF2. アクセシビリティ

- 全セクション `<section id="..." aria-label="...">` を必須。
- StickyNav: `<nav aria-label="ページ内ナビゲーション">`、現在地は `aria-current="location"` で示す。
- EducationAccordion: 開閉ボタンに `aria-expanded` / `aria-controls`、コンテンツ領域に `id` を付与。
- 画像は意味のある `alt`（aria-hidden ではない）。

### NF3. ダークモード

- 既存カラートークン使用で自動対応。
- アコーディオン展開部の境界線・背景は `gray-50` / `gray-100` のトークン使用。

### NF4. パフォーマンス・SSR

- StickyNav / EducationAccordion / useSectionObserver は client component (`'use client'`)。
- PersonalInfoSection / NextReadNav は server component で十分（インタラクションなし）。
- IntersectionObserver は jsdom テストで mock 済み（`vitest.setup.ts`）。

### NF5. 動作確認 (`prefers-reduced-motion`)

- アコーディオンアニメーションは `@media (prefers-reduced-motion: reduce)` 時にトランジションなしで切替。

### NF6. テスト

- 各新規コンポーネントに専用テストファイル。
- フックも単独でテスト（IntersectionObserver mock を活用）。
- `__tests__/app/about/page.test.tsx` を更新し、新セクション (id, StickyNav, PersonalInfoSection, NextReadNav) を検証。

## スコープ外

- プロジェクトカードのメタデータ追加 (Step 4)
- スキルアイコン追加 (Step 4)
- 活動履歴ページ新設 (Step 5)
- About → Hub アンカー連動 (`/about/#career`) — リンク自体は SectionPreview から既に存在。スムーズスクロール対応は Step 3 で StickyNav 実装と一緒に出来る（hash 付きナビゲーション）。

## 完了条件

- 5 機能（StickyNav, 交互背景, EducationAccordion, PersonalInfoSection, NextReadNav）実装完了
- 型・データ・スタイル拡張完了
- 全コンポーネントに対応するテスト追加
- `__tests__/app/about/page.test.tsx` 更新
- `npm run lint && npm run format && npm run build && npx vitest run` 全 PASS
- 手動確認: ブラウザでスティッキーナビ・アコーディオン・パーソナル情報・誘導カードが正常表示
