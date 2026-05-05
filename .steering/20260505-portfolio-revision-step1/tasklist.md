# Step 1: コンテンツ・データ基盤 — タスクリスト

## 実装タスク

- [x] 1. `src/types/index.ts`: Skill に description?: string 追加
- [x] 2. `src/data/navigation.ts`: ラベルを日本語化
- [x] 3. `src/data/metadata.ts`: introduction をポジティブに書き直し + 将来ビジョン追加
- [x] 4. `src/components/home/HeroSection.tsx`: CTA順序入替 + テキスト変更
- [x] 5. `src/data/skills.ts`: 強み順並替え + description追加
- [x] 6. `src/data/projects.ts`: アピール優先順に並替え（現在の順序が既にfeatured先頭・技術→コミュニティ→書籍の適切な順序のため変更不要）
- [x] 7. テスト更新: Header, Footer, HeroSection, page テスト文言修正
- [x] 8. `npm run lint && npm run format && npm run build && npx vitest run` 全PASS確認（152 tests, 19 files, 0 errors）

## レビュー

- **実装完了日**: 2026-05-05
- **計画と実績の差分**: プロジェクト並び替えは現行順序が既に適切だったため変更不要と判断。`lint:fix` スクリプトが存在しなかったため `lint` + `format` で代替。
- **テスト結果**: 19 files, 152 tests, 0 failures
- **変更ファイル**: 8ファイル（型1、データ3、コンポーネント1、テスト4）、新規ファイル0
