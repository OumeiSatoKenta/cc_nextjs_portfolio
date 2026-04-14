# Design: フッターマルチセクション化

## D1: FooterProps の拡張

```ts
interface FooterProps {
  authorName: string;
  socialLinks: SocialLink[];
  siteName: string;           // 新規
  siteDescription: string;    // 新規
  navLinks: NavLink[];        // 新規
}
```

**判断理由**: `NavLink` 型は `src/types/index.ts` に既存。Footer コンポーネントはデータレイヤーに直接依存せず Props 経由でデータを受け取る（アーキテクチャの依存ルール準拠）。

## D2: レイアウト構造

```
<footer .shadow-ring>
  <div .max-w-[1200px] .mx-auto>
    ┌─────────────────────────────────────────────────────────┐
    │ 上段（3カラム: md:grid-cols-3）                            │
    │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
    │ │ サイト名      │ │ ナビリンク   │ │ ソーシャル   │        │
    │ │ 説明文       │ │ (5リンク)    │ │ アイコン     │        │
    │ └─────────────┘ └─────────────┘ └─────────────┘        │
    ├─────────────────────────────────────────────────────────┤
    │ 下段（コピーライト、中央配置）                              │
    │ © 2026 佐藤健太                                          │
    └─────────────────────────────────────────────────────────┘
  </div>
</footer>
```

### モバイル（< md）

3カラムが縦スタックになる（DOM順 = 表示順: サイト情報 → ナビ → ソーシャル）。全セクションを `text-center` で中央配置する（理由: 縦スタック時に左寄せだとシングルカラム内で空白が不均一になるため）。

## D3: スタイリング詳細

### フッター外枠
- `shadow-ring`（既存: `rgba(0, 0, 0, 0.08) 0px 0px 0px 1px`）— 上部ボーダー代わり
- パディング: `px-16 py-40 md:px-32`

### 左カラム（サイト情報）
- サイト名: `text-body-semibold text-vercel-black`（16px, weight 600）
- 説明文: `text-caption text-gray-500`（12px）
- 間隔: `mt-8`

### 中央カラム（ナビゲーション）
- `<nav aria-label="フッターナビゲーション">`
- リンクリスト: `<ul>` + `<li>` 構造
- リンクスタイル: `text-body-small text-gray-500 hover:text-vercel-black transition-colors`
- フォーカス: `focus-visible:shadow-focus focus-visible:outline-none rounded-micro`
- 配置: `flex flex-col gap-8`（縦配列。フッターナビは横並びよりも縦並びが Vercel パターンに近い）
- Next.js `Link` を使用（内部リンクのため）

### 右カラム（ソーシャルアイコン）
- 既存のソーシャルアイコンリストをそのまま移植
- `<ul>` + `<li>` 構造（既存パターン維持）
- アイコンスタイル: 既存の `rounded-circle p-8 text-gray-500 hover:text-vercel-black` 維持

### 下段（コピーライト）
- 上段と下段の間にセパレータ: `border-t border-gray-100`（DESIGN.md §6 の "Section borders" に準拠。ただしフッター内は `#ebebeb`（gray-100）で軽いトーンにする）
- テキスト: `text-caption text-gray-500`（既存パターン維持）
- パディング: `pt-32`
- 中央配置: `text-center`

**`border-t` の使用について**: DESIGN.md §7 は「Don't use traditional CSS border on cards」と規定しているが、これはカード要素に対するルール。フッター内のセパレータは DESIGN.md §6「Section borders: 1px solid #171717 (full dark line) between major sections」に該当する用途であり、フッター内ではよりソフトな `border-gray-100` を使用する。

## D4: layout.tsx の変更

```tsx
<Footer
  authorName={siteMetadata.author.name}
  socialLinks={socialLinks}
  siteName={siteMetadata.name}
  siteDescription={siteMetadata.description}
  navLinks={NAV_LINKS}
/>
```

`NAV_LINKS` と `siteMetadata` は既に `layout.tsx` で import 済み。追加 import 不要。

## D5: テスト戦略

### 既存テストへの影響

既存3テスト:
1. `renders the copyright with the current year and author name` → 影響あり（Props 追加でレンダリング呼び出しの修正が必要）
2. `adds target="_blank" and rel="noopener noreferrer" only to http(s) links` → 影響あり（同上）
3. `renders the same number of social link items as socialLinks entries` → 影響あり（同上。ただしナビリンクも `listitem` としてカウントされるため、セレクタの修正が必要）

### テスト修正方針

- `defaultProps` オブジェクトを作成し、全テストで共通使用
- 3つ目のテスト（listitem カウント）: ソーシャルアイコンの `<ul>` を特定するため、`within` でスコープを絞る、または `aria-label` でソーシャルリンクリストを区別する

### 新規テストケース

1. `'renders the site name'` — `siteName` が表示されること
2. `'renders the site description'` — `siteDescription` が表示されること
3. `'renders navigation links from navLinks'` — `<nav aria-label="フッターナビゲーション">` 内の `within` スコープで `listitem` 数が `navLinks.length` と一致すること
4. `'renders navigation links with correct href'` — 各ナビリンクの href が正しいこと

## D6: ファイル変更一覧

| ファイル | 変更種別 | 内容 |
|---------|---------|------|
| `src/components/layout/Footer.tsx` | 変更 | Props 拡張、3カラム + 下段レイアウト |
| `src/app/layout.tsx` | 変更 | Footer に `siteName`, `siteDescription`, `navLinks` を渡す |
| `__tests__/components/layout/Footer.test.tsx` | 変更 | Props 修正、新規テストケース追加 |

**Footer.tsx 推定行数**: 〜80行（200行規約内。サブコンポーネント分割不要）
