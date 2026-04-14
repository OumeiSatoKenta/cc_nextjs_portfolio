# Requirements: フッターマルチセクション化

## R1: マルチセクションレイアウト

現在の単一行フッター（コピーライト + ソーシャルアイコン）を、3カラム + 下段構成に拡張する。

- **左カラム**: サイト名（`siteMetadata.name`）+ 1行説明（`siteMetadata.description`）
- **中央カラム**: ナビゲーションリンク（`NAV_LINKS` から取得: Home, About, Projects, Blog, Contact）
- **右カラム**: ソーシャルアイコン（既存の `socialLinks`）
- **下段**: コピーライト（既存）

## R2: レスポンシブ対応

DESIGN.md §8: `Footer: multi-column → stacked single column`

- デスクトップ（md以上）: 3カラム横並び
- モバイル: シングルカラムスタック（左→中央→右の順）
- 下段コピーライトは常にフルwidth中央配置

## R3: Props の拡張

`FooterProps` に以下を追加:
- `navLinks: NavLink[]` — ナビゲーションリンク配列
- `siteDescription: string` — サイト説明文
- `siteName: string` — サイト名

## R4: データソース

全データは既存の `src/data/` から取得。新規データファイル不要:
- `siteMetadata.name` → siteName
- `siteMetadata.description` → siteDescription
- `NAV_LINKS` → navLinks
- `socialLinks` → socialLinks（既存）
- `siteMetadata.author.name` → authorName（既存）

## R5: デザインシステム準拠

- DESIGN.md のカラー・タイポグラフィ・シャドウ体系に準拠
- shadow-as-border 技法（`shadow-ring`）をフッター上部境界に使用
- ナビリンクのホバー・フォーカスは既存パターンに従う

## R6: アクセシビリティ

- `<footer>` ランドマーク維持
- ナビゲーションセクションに `<nav aria-label="フッターナビゲーション">`
- 外部リンクに `target="_blank" rel="noopener noreferrer"`（既存ロジック維持）

## R7: 既存テストの互換性

既存の `Footer.test.tsx`（3テストケース）が壊れないこと。Props 追加に伴うテスト修正が必要な場合は対応する。
