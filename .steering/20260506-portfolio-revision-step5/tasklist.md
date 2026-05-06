# Step 5: 活動履歴ページ + ビジュアル仕上げ — タスクリスト

## 実装タスク

### 1. 型定義 + データ追加

- [x] `src/types/index.ts` に `ActivityCategory` と `Activity` interface を追加
- [x] `src/data/activities.ts` を新規作成し、確証ある 4 件のデータを記載

### 2. ナビゲーション拡張

- [x] `src/data/navigation.ts` の NAV_LINKS に `{ href: '/activity', label: '活動履歴' }` を Blog の前に追加

### 3. /activity ページ

- [x] `src/components/activity/ActivityCard.tsx` 新規作成
- [x] `src/components/activity/ActivityTimeline.tsx` 新規作成
- [x] `src/app/activity/page.tsx` 新規作成

### 4. トップページ ActivityPreview 統合

- [x] `src/components/home/ActivityPreview.tsx` 新規作成
- [x] `src/app/page.tsx` の Latest Posts セクションの後に SectionPreview で統合

### 5. プロジェクトサムネイル写真サイズ統一

- [x] `src/components/projects/ProjectThumbnail.tsx` の `h-180` を `aspect-[16/9]` に変更 (image / icon 両方)

### 6. テスト

- [x] 新規: `__tests__/components/activity/ActivityCard.test.tsx`
- [x] 新規: `__tests__/components/activity/ActivityTimeline.test.tsx`
- [x] 新規: `__tests__/components/home/ActivityPreview.test.tsx`
- [x] 新規: `__tests__/app/activity/page.test.tsx`
- [x] 既存: `__tests__/app/page.test.tsx` に Activity セクション検証を追加
- [x] 既存: `__tests__/components/projects/ProjectThumbnail.test.tsx` を `aspect-[16/9]` 検証で更新

### 7. 検証

- [x] `npm run lint` PASS (4 warnings は既存パターン由来 / Step 5 起因の error 0)
- [x] `npm run format` PASS
- [x] `npm run type-check` PASS
- [x] `npm run build` PASS (8 ルート全 Static)
- [x] `npx vitest run` PASS (264/264)

## レビューセクション

### 実装完了日
2026-05-06

### 実績サマリ
- 新規ファイル 8 件 (types 拡張 + activities データ + 4 コンポーネント + 1 ページ + categoryMaps + 4 テスト)
- 変更ファイル 5 件 (navigation, page, ProjectThumbnail, page test, thumbnail test)
- テスト: 231 → 264 件 (+33 件) 全 PASS
- ビルド: 6 ページ → 7 ページ (`/activity` 追加) 全 Static
- F1-F5 完全実装。F6 (Hero タイピング) はスペック通りスコープ外。

### 計画と実績の差分
- design.md 当初は ActivityCard / ActivityPreview にカテゴリマップを直書きしていたが、validation で重複が指摘され `src/components/activity/categoryMaps.ts` に共通化。プロジェクト全体で 2 ヶ所同期するリスクを除去。
- design.md の AnimateOnScroll スコープが曖昧だったので、ActivityTimeline 内部で年セクション単位にラップする方針に確定。

### レビュー結果
- doc-reviewer: [必須] 2 件 (データ日付・ASIN 不整合) を反映済み
- implementation-validator: [必須] 0 件
- 3 軸コードレビュー: 構造 A / 欠陥 B-C / API A、[必須] 0 件
  - 推奨指摘 (URL プロトコル検証 / formatDate 正規表現 / locale 明示) は静的データの境界外であり CLAUDE.md「起こり得ない場面の検証は追加しない」原則に従いスキップ

### 学んだこと
- データ整合性は doc-reviewer が独立検査することで人手チェックより精度高く検出できた。`blog.ts` と `projects.ts` の ASIN/日付差を活動側に転記する際、片方を機械的に採用するのではなく「日付は publishedAt、URL は projects の dp/ASIN」のように既存ソースごとに一次採用基準を明示するとブレない。
- カテゴリマップを 2 コンポーネント間で共有する場合、最初から共通モジュール化したほうが安い。validator 指摘で気付くのは遅い。
- 年のみ (`'YYYY'`) と年月 (`'YYYY-MM'`) の混在ソートは `localeCompare` で文字列順に降順 → 同年内末尾になる挙動が、意味的にも「通年継続」を末尾に並べる結果と一致した。

### 次回への改善提案
- 段階計画 (`docs/ideas/portfolio-revision-plan.md`) は今回完走。Step 5 は計画書通りに収まり、追加スコープなし。
- 将来 Activity データを 10 件以上に拡張する場合は、年別ソート前のデータ層でゼロ埋め検証 (`/^\d{4}(-\d{2}(-\d{2})?)?$/`) を入れると安全。今は 4 件かつ手書きデータなので不要。
