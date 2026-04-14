# 要求定義: ダークモード対応 (U4)

## 概要

ポートフォリオサイトにダークモードを追加する。ユーザーがヘッダーのトグルボタンで「システム設定 / ライト / ダーク」の3モードを切り替えられるようにする。

## 機能要件

1. **テーマ切り替え**: system / light / dark の3モードをサポート
2. **トグルボタン**: ヘッダーに常時表示。Lucide アイコン（Monitor / Sun / Moon）で現在のモードを示す
3. **設定の永続化**: ユーザーの選択を localStorage に保存し、再訪問時に復元
4. **FOUC 防止**: ページ読み込み時にテーマが切り替わるちらつきを防止
5. **CSS変数スワップ方式**: 既存コンポーネントの className を変更せず、CSS カスタムプロパティの値をダークモード用に再定義することで対応

## 非機能要件

- Static Export (`output: 'export'`) との互換性を維持
- `prefers-reduced-motion` のアクセシビリティ対応を維持
- 既存テストが破壊されないこと（Optional props のため）

## 技術選定

- **next-themes**: Next.js App Router 対応のテーマライブラリ。class ベースの切り替え、localStorage 永続化、FOUC 防止スクリプトを内蔵
- **Tailwind CSS v4 @custom-variant**: CSS-first 設定で dark バリアントを定義

## 対象外

- 各コンポーネントへの `dark:` クラスの個別追加（CSS変数スワップで不要）
- ダークモード専用の新規コンポーネント作成
- DESIGN.md のダークモードセクション追加（別フェーズで対応）
