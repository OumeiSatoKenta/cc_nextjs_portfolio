# Tasklist: プロジェクトサムネイル (U5)

## 実装タスク

- [x] 1. `src/types/index.ts` に `ProjectAccentColor`, `ProjectThumbnail` 型追加 + `Project.thumbnail` フィールド
- [x] 2. `src/data/projects.ts` に全 6 件の `thumbnail` データ追加
- [x] 3. `src/components/projects/ProjectThumbnail.tsx` 新規作成
- [x] 4. `src/components/projects/ProjectCard.tsx` に `thumbnail` prop + レイアウト変更
- [x] 5. `src/app/projects/page.tsx` から `thumbnail` prop を渡す
- [x] 6. `__tests__/components/projects/ProjectCard.test.tsx` にサムネイルテスト追加
- [x] 7. lint / type-check / test 全パス確認

## 検証結果

- type-check: パス
- lint: パス（既存の noArrayIndexKey ワーニング3件のみ、今回の変更範囲外）
- test: 141件全パス（サムネイルテスト3件追加）
- build: 静的エクスポート成功

## 3軸コードレビュー

| 軸 | 評価 |
|---|---|
| 構造・アーキテクチャ | A |
| 欠陥・セキュリティ | A |
| API・ドキュメント準拠 | A |

必須修正事項: なし

## 申し送り

- **実装完了日**: 2026-04-14
- **計画と実績の差分**: design.md で `from-ship/20` 等のクラス名を指定していたが、globals.css のトークン名は `--color-ship-red` であり、正しいクラス名は `from-ship-red/20`。実装検証で検出し修正済み。design.md も同時に修正。
- **学んだこと**: Tailwind CSS v4 のカラートークンは `--color-` プレフィックスを除いた全名がクラス名になる（`--color-ship-red` → `ship-red`）。既存コンポーネント（StrengthCard.tsx）のパターンを先に確認すべき。
- **次回への改善提案**: design.md 作成時に globals.css のトークン定義と StrengthCard.tsx 等の既存使用例をクロスチェックする。
