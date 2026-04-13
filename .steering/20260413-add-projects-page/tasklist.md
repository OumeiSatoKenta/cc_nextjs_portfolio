# タスクリスト: Projects ページ（プロジェクト一覧カード）

## Phase 1: 型定義・データ作成

- [x] T1-1: `src/types/index.ts` に Project 型を追加
- [x] T1-2: `src/data/projects.ts` を作成（2 件のプロジェクトデータ）

## Phase 2: ProjectCard 実装

- [x] T2-1: `src/components/projects/ProjectCard.tsx` を実装
- [x] T2-2: `__tests__/components/projects/ProjectCard.test.tsx` を作成

## Phase 3: ページ統合

- [x] T3-1: `src/app/projects/page.tsx` を書き換え（h1 + ProjectCard グリッド）
- [x] T3-2: `__tests__/app/projects/page.test.tsx` を作成

## Phase 4: 品質検証

- [x] T4-1: `npm run lint` がエラーなく成功する
- [x] T4-2: `npm run type-check` がエラーなく成功する
- [x] T4-3: `npm test` が全件 PASS する — 73 / 73 passed
- [x] T4-4: `npm run build` が成功し `out/projects/index.html` が生成される

## Phase 5: レビュー

- [x] T5-1: `implementation-validator` サブエージェントで実装検証 — 4.2/5
- [x] T5-2: 3 軸コードレビュー（structural / secondary-security / docs）を並列実行 — structural: B, security: B([必須]0), docs: C→B(修正後)
- [x] T5-3: レビュー指摘を反映し、総合評価 B 以上・`[必須]` 0 件にする — hover:shadow-md→shadow-full-card, liveUrl テスト強化, technologies 空配列ガード追加

## Phase 6: 振り返り

- [x] T6-1: 本ファイルに「振り返り」セクションを追加
- [x] T6-2: 必要に応じて `docs/` 永続ドキュメントを更新 — knowledge/frontend.md に教訓追記

---

## 振り返り

### 実装完了日
2026-04-13

### 計画と実績の差分
- **計画通り**: Project 型定義、データ作成、ProjectCard コンポーネント、ページ統合、テスト — すべて計画通りに完了
- **意図的な省略**: functional-design.md に記載の `imageUrl`、`longDescription` は MVP スコープ外として省略。`ExternalLink` コンポーネントは未実装（将来タスク）
- **追加作業**: レビューで `hover:shadow-md` → `hover:shadow-full-card` の DESIGN.md 準拠修正、technologies 空配列ガード、liveUrl テストの `target`/`rel` アサーション追加

### 学んだこと
- DESIGN.md に定義されていない Tailwind クラス（`shadow-md` 等）は使わない。hover 状態のシャドウも `shadow-full-card` のようなデザイントークンを使う
- テストで外部リンクの `target="_blank"` と `rel="noopener noreferrer"` は全リンク種別で一貫して検証すべき
- フラットプロップスパターンは F1/F2 と一貫した設計判断として継続（レビューで毎回指摘が出るが intentional deviation）

### 次回への改善提案
- `ExternalLink` 共通コンポーネントを実装すれば、`target="_blank"` / `rel="noopener noreferrer"` の重複を解消できる（次の機能追加時に検討）
- レビュー指摘でフラットプロップスが毎回出るため、design.md にフラットプロップス採用の根拠を明記するとレビューノイズが減る
