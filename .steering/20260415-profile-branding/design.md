# Design: プロフィールブランディング改善

## 変更箇所

### `src/data/metadata.ts`

| フィールド | 変更前 | 変更後 |
|-----------|--------|--------|
| `name` | `'Portfolio'` | `'Kenta Sato'` |
| `title` | `'エンジニアポートフォリオ'` | `'Kenta Sato \| SRE Engineer Portfolio'` |

### 波及効果（コード変更なし、データ変更のみ）

| 箇所 | 参照元 | 表示変更 |
|------|--------|---------|
| ブラウザタブ（トップ） | `layout.tsx` → `siteMetadata.title` | `Kenta Sato \| SRE Engineer Portfolio` |
| ブラウザタブ（サブ） | `layout.tsx` → template `%s \| ${siteMetadata.name}` | `About \| Kenta Sato` 等 |
| ヘッダーロゴ | `Header.tsx` → `siteName` prop | `Kenta Sato` |
| フッターサイト名 | `Footer.tsx` → `siteName` prop | `Kenta Sato` |
| OGP `og:title` | `layout.tsx` → `siteMetadata.title` | `Kenta Sato \| SRE Engineer Portfolio` |
| OGP `og:site_name` | `layout.tsx` → `siteMetadata.name` | `Kenta Sato` |

## 設計判断

- **英語表記を採用**: ヘッダーロゴや OGP には英語名 `Kenta Sato` を使用。Vercel 風デザインシステムの英語ベース UI と一致する。`author.name` の日本語表記 `佐藤健太` は About ページ等のコンテンツ内で引き続き使用。
- **データ変更のみ**: コンポーネントは既に `siteMetadata.name` / `siteMetadata.title` を参照しているため、コード変更は不要。
