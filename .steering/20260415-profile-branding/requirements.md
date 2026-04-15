# Requirements: プロフィールブランディング改善

## 目的

ポートフォリオサイトにアクセスした際、誰のサイトかが即座に分かるようにする。

## 要件

1. **ブラウザタブ**: タイトルに佐藤健太の名前を含める
   - トップページ: `Kenta Sato | SRE Engineer Portfolio`
   - サブページ: `About | Kenta Sato` 等（template 形式）

2. **ヘッダーロゴ**: ナビゲーション左端の表示を `Portfolio` → `Kenta Sato` に変更

3. **OGP**: `og:title` および `og:site_name` にも名前を反映

## 制約

- 変更対象は `src/data/metadata.ts` の `siteMetadata` のみ
- `Header.tsx` や `layout.tsx` のコード変更は不要（既に `siteMetadata.name` を参照している）
- `Footer.tsx` も `siteName` prop を受け取っているため自動的に反映される
- 既存テストは `SITE_NAME = 'Test Site'` を使用しているため壊れない

## 検証コマンド

- `npm run type-check`
- `npm run lint`
- `npm test`
- `npm run build`
