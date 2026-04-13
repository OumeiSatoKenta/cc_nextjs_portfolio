# タスクリスト: ブログリンク集ページ（F4: /blog）

## Phase 1: 型定義・データ作成

- [x] T1-1: `src/types/index.ts` に BlogPlatform 型と BlogPost 型を追加
- [x] T1-2: `src/data/blog.ts` を作成（公開コンテンツ 2 件）

## Phase 2: BlogCard 実装

- [x] T2-1: `src/components/blog/BlogCard.tsx` を実装
- [x] T2-2: `__tests__/components/blog/BlogCard.test.tsx` を作成

## Phase 3: ページ統合

- [x] T3-1: `src/app/blog/page.tsx` を書き換え（h1 + BlogCard グリッド）
- [x] T3-2: `__tests__/app/blog/page.test.tsx` を作成

## Phase 4: 品質検証

- [x] T4-1: `npm run lint` がエラーなく成功する
- [x] T4-2: `npm run type-check` がエラーなく成功する
- [x] T4-3: `npm test` が全件 PASS する — 88 / 88 passed
- [x] T4-4: `npm run build` が成功し `out/blog/index.html` が生成される

## Phase 5: レビュー

- [x] T5-1: `implementation-validator` サブエージェントで実装検証 — 4.6/5
- [x] T5-2: 3 軸コードレビュー（structural / secondary-security / docs）を並列実行 — structural: B, security: B/C, docs: B/C
- [x] T5-3: レビュー指摘を反映し、総合評価 B 以上・`[必須]` 0 件にする — tags key修正, gap-16統一, 日付フォーマット日本語化, metadata追加, functional-design.md更新

## Phase 6: 振り返り

- [x] T6-1: 本ファイルに「振り返り」セクションを追加
- [x] T6-2: 必要に応じて `docs/` 永続ドキュメントを更新 — functional-design.md の BlogPlatform に 'amazon' 追加

---

## 振り返り

### 実装完了日
2026-04-13

### 計画と実績の差分
- **計画通り**: BlogPost 型定義、データ作成、BlogCard コンポーネント、ページ統合、テスト — すべて計画通りに完了
- **追加作業**: ドキュメントレビューの提案で BlogPlatform に `'amazon'` を追加。コードレビューで `<time>` 表示の日本語フォーマット化、metadata export 追加、tags key 修正、gap 統一。ユーザー指示で BlogCard を card-as-link から article + 下部リンクパターンに変更（ProjectCard と統一）
- **スコープ維持**: ExternalLink / Badge 共通化は将来タスクとして据え置き

### 学んだこと
- `<time>` 要素は `dateTime` に機械可読形式、表示テキストに人間可読形式を分離すべき（HTML Living Standard）
- BlogCard を ProjectCard と同じ `<article>` + 下部リンクパターンに統一。カード全体を `<a>` にするより、セマンティクスの一貫性が高い
- `BlogPlatform` のようなユニオン型は実データに合わせて拡張する方が `'other'` に丸めるより表現力が高い

### 次回への改善提案
- `Badge` 共通コンポーネント（`src/components/ui/Badge.tsx`）を実装し、ProjectCard / BlogCard のバッジ重複を解消する
- ページの `metadata` export は最初から含める（F1〜F3 にも追加検討）
