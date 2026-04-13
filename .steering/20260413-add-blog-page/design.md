# 設計: ブログリンク集ページ（F4: /blog）

## 型定義

`src/types/index.ts` に追加:

```typescript
export type BlogPlatform = 'zenn' | 'qiita' | 'note' | 'other';

export interface BlogPost {
  title: string;
  url: string;
  publishedAt: string;       // "2025-01-15" 形式
  platform: BlogPlatform;
  description?: string;
  tags?: string[];
}
```

## データ

`src/data/blog.ts`:
- 職務経歴書記載の公開コンテンツ 2 件（Kindle 共著本、ハンズオン本）
- `platform: 'other'`（書籍のため）
- 新しい順にソート

## コンポーネント設計

### BlogCard

**パス**: `src/components/blog/BlogCard.tsx`

**Props**: フラットプロップスパターン（F1〜F3 と一貫）

```typescript
interface BlogCardProps {
  title: string;
  url: string;
  publishedAt: string;
  platform: BlogPlatform;
  description?: string;
  tags?: string[];
}
```

**表示要素**（functional-design.md 準拠）:
- 記事タイトル: `text-card-title-light`（Geist 24px weight 500）
- 投稿日: `text-caption` + `font-geist-mono`
- プラットフォーム: Pill Badge（`rounded-pill bg-badge-blue-bg text-badge-blue-text px-10 py-3 text-caption font-medium`）
- 概要: `text-body-small text-gray-600`
- タグ: Pill Badge（概要と同じスタイル）
- カード全体が `<a>` リンク（`target="_blank"`, `rel="noopener noreferrer"`）

**カードデザイン**:
- 背景: `bg-pure-white`
- 角丸: `rounded-comfortable`（8px）
- 影: `shadow-subtle-card`
- ホバー: `hover:shadow-full-card`（DESIGN.md 準拠）

### ページ

**パス**: `src/app/blog/page.tsx`

**レイアウト**: F3 Projects ページと同じパターン
- h1 "Blog" + サブタイトル
- グリッド表示（`md:grid-cols-2`）
- `blog.ts` からデータ import → `BlogCard` に展開

## テスト計画

### BlogCard.test.tsx
- タイトル表示
- 投稿日表示
- プラットフォームバッジ表示
- 概要表示
- リンク属性（href, target, rel）
- タグ表示（ある場合）
- タグなしの場合

### page.test.tsx
- h1 表示
- サブタイトル表示
- 全記事タイトル表示
- カード数一致
- リンク数一致
