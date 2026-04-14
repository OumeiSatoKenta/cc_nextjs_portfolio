# 設計: About ページイントロ文追加 (C1)

## 変更ファイル

### 1. `src/types/index.ts`
`SiteMetadata.author` に `introduction: string` を追加。

### 2. `src/data/metadata.ts`
```typescript
introduction: 'マルチクラウド（AWS / Google Cloud）環境での IaC 設計・構築・運用を軸に、AI 駆動開発の導入推進やパフォーマンス改善・コスト最適化に取り組む SRE エンジニアです。技術書の共著やコミュニティ運営を通じた技術発信にも力を入れています。',
```

### 3. `src/app/about/page.tsx`
ヘッダー section と Career section の間に新セクション挿入:

```tsx
<section className="mx-auto max-w-[1200px] px-16 pb-40 md:px-32" aria-label="自己紹介">
  <AnimateOnScroll>
    <h2 className="text-sub-heading text-vercel-black">Introduction</h2>
    <p className="mt-16 text-body-large text-gray-600">
      {siteMetadata.author.introduction}
    </p>
  </AnimateOnScroll>
</section>
```

`siteMetadata` を `@/data/metadata` からインポート。

### 4. `__tests__/app/about/page.test.tsx`
イントロテキストの表示確認テストを追加。

## デザイントークン活用 (U1)
- `text-sub-heading`: 32px, weight 400, line-height 1.5, letter-spacing -1.28px
- DESIGN.md の Typography Hierarchy に定義済み、globals.css の `@theme` で実装済み
