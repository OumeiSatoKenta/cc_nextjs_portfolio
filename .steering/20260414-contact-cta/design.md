# Design: Contact ページ CTA 強化

## アプローチ

Contact ページ (`src/app/contact/page.tsx`) にインラインで CTA セクションを追加。ページ内 1 箇所のみなので新規コンポーネント不要。

メールアドレスと LinkedIn URL は `src/data/social.ts` から `find` で取得し、ハードコードを避ける。

## スタイリング

- CTA カード: `rounded-image bg-pure-white shadow-subtle-card p-32`
- 見出し: `text-sub-heading-large text-vercel-black`
- 説明文: `text-body-small text-gray-600`
- Primary CTA: HeroSection と同じ `bg-vercel-black` ボタン
- Secondary CTA: HeroSection と同じ ghost ボタン + `target="_blank" rel="noopener noreferrer"`
- 補足: `text-button-small text-gray-400`

## 影響範囲

| ファイル | 変更内容 |
|---------|---------|
| `src/app/contact/page.tsx` | CTA セクション追加 |
| `__tests__/app/contact/page.test.tsx` | CTA 関連テスト追加 |
