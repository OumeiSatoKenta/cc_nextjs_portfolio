# タスクリスト: About ページ（経歴タイムライン・スキル一覧）

## Phase 1: 型定義・データ作成

- [x] T1-1: `src/types/index.ts` に Career / SkillCategory / SkillLevel / Skill / Education 型を追加
- [x] T1-2: `src/data/career.ts` を作成（5 件の職歴データ、新しい順）
- [x] T1-3: `src/data/skills.ts` を作成（4 カテゴリのスキルデータ）
- [x] T1-4: `src/data/education.ts` を作成（学歴データ）

## Phase 2: TimelineItem 実装

- [x] T2-1: `src/components/about/TimelineItem.tsx` を実装（会社名 / 期間 / 役割 / 成果 / 技術タグ / 縦線）
- [x] T2-2: `__tests__/components/about/TimelineItem.test.tsx` を作成

## Phase 3: Timeline 実装

- [x] T3-1: `src/components/about/Timeline.tsx` を実装（Career 配列を受け取り TimelineItem を列挙）
- [x] T3-2: `__tests__/components/about/Timeline.test.tsx` を作成

## Phase 4: SkillGrid 実装

- [x] T4-1: `src/components/about/SkillGrid.tsx` を実装（カテゴリ別グリッド + レベル別バッジスタイル）
- [x] T4-2: `__tests__/components/about/SkillGrid.test.tsx` を作成

## Phase 5: ページ統合

- [x] T5-1: `src/app/about/page.tsx` を書き換え（h1 + Career / Skills / Education セクション）
- [x] T5-2: `__tests__/app/about/page.test.tsx` を作成

## Phase 6: 品質検証

- [x] T6-1: `npm run lint` がエラーなく成功する
- [x] T6-2: `npm run type-check` がエラーなく成功する
- [x] T6-3: `npm test` が全件 PASS する（既存テスト含む） — 59 / 59 passed
- [x] T6-4: `npm run build` が成功し `out/about/index.html` が生成される

## Phase 7: レビュー

- [x] T7-1: `implementation-validator` サブエージェントで実装検証 — 4.7/5
- [x] T7-2: 3 軸コードレビュー（structural / secondary-security / docs）を並列実行 — 構造 A / 欠陥 B / API B
- [x] T7-3: レビュー指摘を反映し、総合評価 B 以上・`[必須]` 0 件にする — [推奨] 4 件修正済み（dateTime属性・font-medium・achievementキー）

## Phase 8: 振り返り

- [x] T8-1: 本ファイルに「振り返り」セクションを追加
- [x] T8-2: 必要に応じて `docs/` 永続ドキュメントを更新 — About ページは既存 docs に影響なし

---

## 振り返り

### 実装完了日
2026-04-13

### 計画と実績の差分

| 項目 | 計画 | 実績 |
|------|------|------|
| フェーズ数 | 8 | 8（変更なし） |
| コンポーネント数 | 3（TimelineItem, Timeline, SkillGrid） | 3（計画通り） |
| テスト数 | 未定 | 24 件（TimelineItem 8 + Timeline 2 + SkillGrid 6 + Page 8） |
| 品質評価 | B 以上目標 | 構造 A / 欠陥 B / API B（B+ 相当） |

### 学んだこと

1. **`<time>` 要素には必ず `dateTime` 属性を付与する** — HTML仕様・WCAG準拠。レビューで指摘され修正。今後テンプレ化すべき。
2. **Tailwind JIT では動的クラス名が使えない** — `LEVEL_BADGE_CLASS` のような静的マップパターンで対応。F1 の StrengthCard と同じパターンを踏襲。
3. **テストで `getByText` は画面全体を検索する** — Career の技術タグと SkillGrid の両方に "AWS" が存在し衝突。カテゴリ見出しでの検証に切り替えて解決。
4. **DESIGN.md の Badge/Caption には `font-medium`（weight 500）が必要** — レビューで指摘。Pill Badge 仕様を再確認して全箇所に適用。
5. **Props 分解パターン（flat props）はコンポーネント再利用性を高める** — Career オブジェクト直接渡しではなく個別 props に分解。design.md に意図的逸脱として記載。

### 次回への改善提案

1. **`<time dateTime>` チェックをカスタム ESLint ルールで自動化する** — 手動レビュー依存を減らす
2. **Badge コンポーネントの共通化を検討** — TimelineItem と SkillGrid で同じ Pill Badge パターンが重複。F3 以降で共通 Badge コンポーネント抽出を検討
3. **テストデータのファクトリ関数導入** — テストファイル間でモックデータの重複あり。`__tests__/factories/` に集約すると保守性向上
