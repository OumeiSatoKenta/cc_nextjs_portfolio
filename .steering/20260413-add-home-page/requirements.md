# 要求内容: トップページ（HeroSection・StrengthCard）

## 背景・目的

PRD F1「トップページ（/）」を実装する。採用担当者・コミュニティ参加者が本サイトを訪れた際、**数秒で「何をしている人か」を把握**できるよう、ヒーローセクション（名前・肩書き・CTA）と 3 つの強みサマリ（マルチクラウド / AI駆動開発 / パフォーマンス改善）を提供する。

既に F6 共通レイアウト（Header / Footer / Navigation）は実装済み。本タスクでは `src/app/page.tsx` のプレースホルダを置き換え、`src/components/home/` 配下にコンポーネントを追加する。

## 関連ドキュメント

- `docs/product-requirements.md` — F1 セクション（L55-67）
- `docs/functional-design.md` — トップページコンポーネント設計（L342-388）、ページ構成詳細（L640-665）、タイポグラフィ適用マッピング（L812-816）
- `DESIGN.md` — Display Hero / Card Title / Primary Dark Button / Workflow Accent Colors
- `tailwind.config.ts` — デザイントークン（既存）
- `/home/vscode/.claude/projects/-workspaces-cc-nextjs-portfolio/memory/project_resume_facts.md` — 本人情報の要点（強みテーマの文言調整に参照）

## 機能要求

### FR-1: HeroSection コンポーネント

**責務**: ファーストビューでの自己紹介表示

**Props**:
```typescript
interface HeroSectionProps {
  name: string;
  tagline: string;
}
```

**受け入れ条件**:
- [ ] 名前を Display Hero（Geist 48px weight 600、letter-spacing -2.4px）で表示
- [ ] 肩書きを Body Large（Geist 20px weight 400、Gray 600）で表示
- [ ] CTA ボタン「Projects を見る」を Primary Dark スタイルで表示、`/projects/` へ Next.js `<Link>` 遷移
- [ ] セマンティック: `<section>` でラップ、見出しは `<h1>` とする（トップページのメインヘッディング）
- [ ] レスポンシブ: 中央寄せ。モバイル（<768px、Tailwind の `md` 未満）では左右パディング 16px（`px-16`）、タブレット・デスクトップ（≥768px、`md:` 以上）では最大幅 1200px + パディング 32px（`md:px-32`）

### FR-2: StrengthCard コンポーネント

**責務**: 3 つの強みをカード形式で表示

**Props**:
```typescript
interface StrengthCardProps {
  title: string;
  description: string;
  accentColor: 'ship' | 'preview' | 'develop';
}
```

**受け入れ条件**:
- [ ] タイトルを Card Title（Geist 24px weight 600、letter-spacing -0.96px）で表示
- [ ] 説明文を Body Small（Geist 16px weight 400、Gray 600）で表示
- [ ] accentColor に応じた上部アクセントバー（高さ 4px、幅 100%）を表示
  - `ship` → Ship Red `#ff5b4f`
  - `preview` → Preview Pink `#de1d8d`
  - `develop` → Develop Blue `#0a72ef`
- [ ] カード背景 `#ffffff`、角丸 8px（`rounded-comfortable`）、Subtle Card shadow（`shadow-subtle-card`）
- [ ] セマンティック: `<article>` でラップ、タイトルは `<h3>` とする
- [ ] アクセントカラー値はハードコードせず Tailwind ユーティリティ（`bg-ship-red` / `bg-preview-pink` / `bg-develop-blue`）を使用

### FR-3: トップページ統合（app/page.tsx）

**受け入れ条件**:
- [ ] 既存のプレースホルダ実装を削除し、HeroSection と 3 枚の StrengthCard を表示
- [ ] データソースは `siteMetadata.author` から取得（`name`, `tagline`, `strengths`）
- [ ] 強みセクションは `<section>` でラップ
- [ ] レイアウト:
  - モバイル（<768px）: 1 カラム縦積み
  - タブレット（768-1023px）: 2 カラムグリッド
  - デスクトップ（≥1024px）: 3 カラムグリッド
- [ ] ヒーローと強みセクションの縦間隔は既存 spacing トークンの組み合わせで確保する。HeroSection 下端 `py-40`（下 40px）+ 強みセクション上端の暗黙マージン・下端 `pb-40`（40px）で **縦方向余白 80px** を確保し、任意値（`[64px]`）は使用しない（デザイントークン厳守）

### FR-4: データ定義の微調整

**受け入れ条件**:
- [ ] `siteMetadata.author.name` は**氏名 PII 禁止ルールに従いプレースホルダ `"Your Name"` のまま**維持（ユーザーが手元でのみ置換）
- [ ] `siteMetadata.author.tagline` を現状の `"Software Engineer"` から **`"SRE Engineer — Multi-Cloud · IaC · AI-Driven Development"`** に更新（PII 非該当、ポートフォリオの芯を明示）
- [ ] 3 つの `strengths.description` を資料メモリ記載の技術的特徴を反映した 50-80 文字程度に拡充（PII 非該当）
  - マルチクラウド → AWS / Google Cloud を Terraform で IaC 化した実運用経験
  - AI駆動開発 → Claude Code 導入主導。Skills / Agents / MCP 連携による開発プロセス設計
  - パフォーマンス改善 → 負荷試験・スロークエリ改善・コスト最適化の定量成果

### FR-5: テスト

**受け入れ条件**:
- [ ] `__tests__/components/home/HeroSection.test.tsx` を新規作成
  - 名前が `<h1>` として表示されること
  - 肩書きが表示されること
  - CTA リンクが `/projects/` へ貼られていること
- [ ] `__tests__/components/home/StrengthCard.test.tsx` を新規作成
  - タイトル・説明が表示されること
  - accentColor 3 種それぞれで正しい Tailwind クラスが適用されること（snapshot ではなく実クラス検証）
  - `<article>` でラップされ `<h3>` を持つこと
- [ ] `__tests__/app/page.test.tsx` を新規作成
  - 既存の「Home」プレースホルダ文言ではなく、HeroSection と 3 枚のカードが表示されること

## 非機能要求

### NFR-1: 既存パターンとの整合性

- `'use client'` ディレクティブは**状態・イベントが必要なコンポーネントのみ**付与（HeroSection / StrengthCard はサーバーコンポーネントのまま）
- Props は named export、default export は禁止
- ファイル名: PascalCase `.tsx`
- クラス順序は Prettier plugin で自動整列

### NFR-2: アクセシビリティ

- 見出し階層: `<h1>` → `<h3>`（`<h2>` は強みセクションの見出しに使う余地を残す）
- アクセントバーには `aria-hidden="true"` を付与（装飾のため）
- CTA リンクは視認可能な `focus-visible` スタイル（`shadow-focus`）

### NFR-3: パフォーマンス

- 画像は使用しない（MVP ではアイコン・写真なし）
- Framer Motion など追加ライブラリは使用しない（Post-MVP F8 で対応）

### NFR-4: ポートフォリオコンテンツの一次ソース（CLAUDE.md）

- **氏名は PDF に記載されている実名（佐藤健太）をソースコードに直接書き込まない**。`siteMetadata.author.name` はプレースホルダ `"Your Name"` のまま。
- **肩書き・強みの表現**は PDF / メモリからの「職務要約 / 自己 PR」レベルの文言に留める。
- 公開可否がグレーの具体数値（コスト削減率・金額・ユーザー規模倍率）は**今回は含めない**（Projects ページ F3 で扱うか別途確認）。

## スコープ外

- About / Projects / Blog / Contact ページの実装（F2〜F5）
- アニメーション（Framer Motion）— Post-MVP F8
- ダークモード — Post-MVP F9
- OGP 画像の自動生成 — Post-MVP F11
- `src/data/metadata.ts` の `name` の実名への置換（ユーザー側ローカル作業）
- トップページへの Featured Projects / 最近のブログセクション追加（PRD F1 の範囲外）
- About / Blog / Contact への個別導線の追加 — Header Navigation（F6 実装済み）が PRD F1 の「各セクションへの導線」を満たすため、本タスクではヒーロー CTA（`/projects/`）のみとする

## 完了条件

1. 3 コンポーネント（HeroSection, StrengthCard, Home page）が実装されレンダリングされる
2. テストが全て通る（Jest + RTL）
3. `npm run lint` / `npm run type-check` / `npm run build` が全て成功し、`out/index.html` が正しく生成される
4. 3 軸コードレビュー総合評価 B 以上、`[必須]` 0 件
5. 目視確認: `npm run dev` で `http://localhost:3000/` を開き、ヒーロー + 3 カードが期待どおり表示される
