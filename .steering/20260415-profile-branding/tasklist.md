# Tasklist: プロフィールブランディング改善

## 実装タスク

- [x] 1. `src/data/metadata.ts` を更新
  - [x] 1-1. `name`: `'Portfolio'` → `'Kenta Sato'`
  - [x] 1-2. `title`: `'エンジニアポートフォリオ'` → `'Kenta Sato | SRE Engineer Portfolio'`
- [x] 2. 検証
  - [x] 2-1. `npm run type-check` 通過
  - [x] 2-2. `npm run lint` 通過（既存 warning 3件のみ）
  - [x] 2-3. `npm test` 152件全パス
  - [x] 2-4. `npm run build` 静的エクスポート成功

## 申し送り

- **実装完了日**: 2026-04-15
- **計画と実績の差分**: なし。design.md の通り `metadata.ts` の2フィールド変更のみで完了。
- **学んだこと**: データ駆動設計（コンポーネントが `siteMetadata` を prop 経由で受け取る設計）が功を奏し、データファイル1箇所の変更でヘッダー・フッター・タブタイトル・OGP が一括更新された。
- **次回への改善提案**: `siteMetadata.url` がプレースホルダ（`https://example.com`）のまま残っている。ドメイン確定後に別タスクで更新する。
