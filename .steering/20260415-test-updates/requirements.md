# Requirements: Phase 5 テスト更新

## 目的

Phase 1-4 で追加・変更されたコンポーネントのテストカバレッジを補完する。

## 要件

1. `ProjectThumbnail` コンポーネントの独立テストを新規作成
   - 各 accentColor (ship/preview/develop) のグラデーションクラス検証
   - 各アイコンの正常レンダリング
   - 不明アイコンの null 返却
   - image 指定時の img 要素レンダリング
   - fit プロパティ（cover/contain）のクラス切替

2. 既存テストの動作確認
   - 全テストがパスすること
   - Phase 1-4 の変更で壊れたテストがないこと

3. 検証コマンド全パス
   - `npm run type-check`
   - `npm run lint`
   - `npm test`
   - `npm run build`
