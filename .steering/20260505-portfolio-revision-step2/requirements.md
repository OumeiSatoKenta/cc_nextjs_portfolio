# Step 2: トップページ Hub 化 — 要件定義

## 目的

トップページ (`/`) を「全ページのプレビュー＋動線が揃ったコンテンツハブ」として機能させる。現状は Hero + 強みカード3枚のみで、訪問者が About / Projects / Blog 各ページに移動する動機・予告が不足している。

参照: `docs/ideas/portfolio-revision-plan.md` (Step 2 範囲のみ)

## 前提

- Step 1 完了済み（ナビ日本語化、CTA 順序入替、スキル / プロジェクト並び替え、`Skill.description` 追加）。
- 既存テスト 152 件 PASS。

## 機能要件

### F1. 経歴概要セクション (CareerSummary)

- 配置: Hero と StrengthCard の間
- 表示内容: 直近キャリア 3 件（現職含む）の要約
  - 会社名（実名 or 業界記述、`careers[].company`）
  - 役割 (`careers[].role`)
  - 期間 (`careers[].period`)
- 「経歴を詳しく見る」リンクで `/about` へ遷移（`#career` アンカーは Step 3 で実装）。
- セクション見出しは「Career」または「経歴」。

### F2. スキルプレビュー (SkillsPreview)

- 配置: StrengthCard の後
- 表示内容: `skills` から `level === 'expert' || level === 'advanced'` のスキル全件をバッジ表示（現状 8 件: AWS / Google Cloud / Terraform / Terragrunt / Aurora MySQL / Docker / Git / GitHub / Jenkins / Claude Code (AI)）。
  - **要件確認**: 計画書では「上位 6-8 個」だが現状の expert/advanced は 10 件。バッジ列挙のみなので 10 件全件を表示する方が一覧性が高いと判断。横方向に flex-wrap で配置。
- 「スキルを詳しく見る」リンクで `/about` へ。

### F3. Featured プロジェクト (FeaturedProjects)

- 配置: SkillsPreview の後
- 表示内容: `projects` から `featured === true` のプロジェクトを `ProjectCard` で表示（現状 2 件: portfolio-site, portfolio-infra）。
- 「すべてのプロジェクトを見る」リンクで `/projects` へ。

### F4. 最新ブログ (LatestBlog)

- 配置: FeaturedProjects の後
- 表示内容: `blogPosts` から `publishedAt` 降順で最新 3 件を `BlogCard` で表示。
- 「すべての記事を見る」リンクで `/blog` へ。

### F5. 共通プレビューラッパー (SectionPreview)

- F1〜F4 で共通する以下の構造をラップする:
  - セクション見出し (`<h2>`)
  - 「もっと見る」リンク (右上)
  - 子要素 (children)
  - `<section>` タグ＋ `aria-label`
- props: `title`, `href`, `linkLabel`, `ariaLabel`, `children`

## 非機能要件

### NF1. 既存パターン準拠

- レイアウト: `mx-auto max-w-[1200px] px-16 md:px-32 py-40` を踏襲。
- 見出し: `text-section-heading text-vercel-black`。
- カード: `rounded-comfortable bg-pure-white p-32 shadow-subtle-card` (BlogCard と同形)。
- バッジ（カード内タグ）: `rounded-pill bg-badge-*-bg text-badge-*-text px-10 py-3 text-caption`。SkillsPreview のスキルチップもこのトークン体系に従う（level により bg/text を切替）。
- リンク: `text-link-blue hover:underline`。
- 各セクションは `<AnimateOnScroll>` でラップしフェードインアニメーションを付与（既存 `page.tsx` と同様、`delay` でずらす）。

### NF2. アクセシビリティ

- 各セクション `<section aria-label="...">` を必須。
- 「もっと見る」リンクは `<Link>` (Next.js) を使用、絶対パスは末尾スラッシュ `/about/` 形式（既存と整合）。
- 強調コントラスト・focus-visible は既存のクラスを継承。

### NF3. ダークモード

- 既存のカラートークンを使うため自動対応（個別調整なし）。

### NF4. テスト

- 各新規コンポーネントに専用テストファイル。
- データ駆動アサーションは `siteMetadata` / `careers` / `skills` / `projects` / `blogPosts` を直接 import して件数・内容を検証（既存 `page.test.tsx` のスタイル）。
- `__tests__/app/page.test.tsx` を更新し新セクションの存在確認を追加。

### NF5. 静的データの一貫性

- featured フラグを持つプロジェクトが将来 0 件 / 3 件以上になっても破綻しないように、`FeaturedProjects` は `projects.filter((p) => p.featured)` をそのまま map（件数固定の前提なし）。
- `LatestBlog` は `[...blogPosts].sort(...).slice(0, 3)` で常に最新 3 件。

## スコープ外

- 活動履歴プレビュー（Step 5）
- StickyNav / About 強化（Step 3）
- プロジェクトカードのメタデータ追加（Step 4）
- スキルアイコン (Step 4)

## 完了条件

- 5 つの新規コンポーネント実装完了
- `src/app/page.tsx` に統合
- 全ファイルに対応するテスト追加
- `__tests__/app/page.test.tsx` 更新
- `npm run lint && npm run format && npm run build && npx vitest run` 全 PASS
