# Tasklist: Phase 3-C2 — Side Projects

## 実装タスク

- [x] T1: `src/types/index.ts` — Project 型に `metrics` / `linkLabel` 追加
- [x] T2: `src/data/navigation.ts` — `Projects` → `Side Projects`
- [x] T3: `src/data/projects.ts` — 新規3件追加 + TiUG に metrics/linkLabel
- [x] T4: `src/components/projects/ProjectCard.tsx` — metrics / linkLabel 表示対応
- [x] T5: `src/app/projects/page.tsx` — タイトル変更 + 新props渡し
- [x] T6: `src/components/home/HeroSection.tsx` — CTA テキスト変更
- [x] T7: `__tests__/components/projects/ProjectCard.test.tsx` — テスト更新

## 検証

- [x] V1: `npm run type-check` — パス
- [x] V2: `npm run lint` — パス（既存 warnings のみ）
- [x] V3: `npm run test` — 134/134 パス
- [x] V4: `npm run build` — Static Export 成功

## レビュー

### 変更サマリ
- **型拡張**: `Project` に `metrics` / `linkLabel` 追加（optional → 破壊的変更なし）
- **ナビ/ページ**: Projects → Side Projects リブランド（nav, h1, subtitle, Hero CTA）
- **データ**: 3件の新プロジェクト追加（AWS資格本/Amplifyハンズオン本/JAWS勉強会）+ TiUG にメトリクス/linkLabel
- **ProjectCard**: メトリクス表示（`dl`/`dd`/`dt` セマンティクス）+ linkLabel 対応
- **テスト**: 3テストファイルのテキスト更新 + 4新テストケース追加（linkLabel default/custom, metrics表示/非表示）

### 追加で更新したテストファイル
- `__tests__/app/page.test.tsx` — CTA テキスト更新
- `__tests__/components/home/HeroSection.test.tsx` — CTA テキスト更新
- `__tests__/app/projects/page.test.tsx` — h1 / subtitle テキスト更新

## 申し送り事項

- **実装完了日**: 2026-04-14
- **計画と実績の差分**: 当初 C2 のみの計画だったが、ユーザーリクエストでカード高さ揃え・About充実化・Education拡張が追加。同一PRに統合。
- **学び**:
  - `dt`/`dd` の DOM 順序は HTML 仕様で規定されており、視覚順序の調整は `flex-col-reverse` で対応可能
  - Education の type ユニオンを拡張した場合、UI の条件分岐も網羅的に更新する必要がある
  - グリッドカードの高さ揃えは `h-full` を AnimateOnScroll ラッパー + カード article の両方に付ける
- **次回への改善**: 型のユニオン拡張時に UI の全分岐をチェックするルールを knowledge/frontend.md に追加検討
