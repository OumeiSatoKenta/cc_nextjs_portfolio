# Requirements: プロジェクトサムネイル (U5)

## 概要

Side Projects ページのカードにグラデーション背景 + Lucide アイコンによるサムネイルプレースホルダーを追加する。実画像を用意せずに視覚的な差別化を実現する。

## 機能要件

### FR-1: 型定義
- `ProjectAccentColor` 型: `'ship' | 'preview' | 'develop'`（既存 Workflow Accent Colors）
- `ProjectThumbnail` インターフェース: `{ accentColor: ProjectAccentColor; icon: string }`
- `Project` 型に `thumbnail?: ProjectThumbnail` を追加

### FR-2: プロジェクトデータにサムネイル情報追加
- 全 6 プロジェクトに `thumbnail` データを追加
- アイコン名は Lucide の名前付きエクスポートから選択

### FR-3: ProjectThumbnail コンポーネント
- accentColor に対応するグラデーション背景
- Lucide アイコン (48px) を中央配置、60% opacity
- `rounded-image` (12px) 、高さ 180px 固定
- `aria-hidden="true"`（装飾目的）

### FR-4: ProjectCard にサムネイル統合
- `thumbnail` prop を追加（optional）
- カード上部にフルブリード配置（負マージン）
- `overflow-hidden` で角丸をクリップ

### FR-5: テスト
- ProjectCard テストにサムネイル関連テスト追加
- ProjectThumbnail コンポーネントのレンダリングテスト
