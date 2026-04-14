# Design: スクロールトリガーアニメーション

## D1: 技術選定

### CSS keyframes + IntersectionObserver（Framer Motion 不使用）

| 観点 | CSS keyframes | Framer Motion |
|------|--------------|---------------|
| バンドルサイズ | 0 KB | ~50 KB (gzip) |
| テスト互換性 | モック不要 | `vi.mock('framer-motion')` 必須 |
| DESIGN.md 記載 | — | Post-MVP P1 として記載 |
| 機能十分性 | fade-in-up に十分 | オーバーキル |

**結論**: CSS keyframes + ネイティブ IntersectionObserver API。バンドルコスト 0、テスト互換性が高い。

### architecture.md Post-MVP P1 との関係

architecture.md では Framer Motion を Post-MVP P1 として記載しているが、今回の実装で fade-in-up ユースケースが CSS keyframes + IntersectionObserver で十分に満たされることを確認した。Framer Motion はページ遷移アニメーション等のより複雑なユースケースが発生した場合に検討する。

移行する場合: `AnimateOnScroll` コンポーネントを Framer Motion の `motion.div` ベースに差し替えるだけでよく、呼び出し側ページへの影響はない（コンポーネント境界で吸収）。

## D2: `useInView` カスタムフック

### ファイル: `src/hooks/useInView.ts`

```ts
'use client';

import { useEffect, useRef, useState } from 'react';

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, ...options },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
}
```

### 設計判断

- **`threshold: 0.1`**: 要素の 10% がビューポートに入ったら発火。0 だと早すぎ、0.5 だとスクロール量が多すぎる
- **`once` (unobserve)**: 一度発火したら Observer を解除。パフォーマンス最適化 + 再トリガー防止
- **`options` パラメータ**: デフォルト値を上書き可能にするが、Phase 3 では使用しない
- **`disconnect` on cleanup**: effect のクリーンアップで Observer を破棄。メモリリーク防止

### `options` の参照安定性

`useEffect` の依存配列に `options` オブジェクトを含めると、呼び出し側が毎レンダリングで新しいオブジェクトを渡した場合に不要な再実行が起こる。Phase 3 では `AnimateOnScroll` が `options` を渡さない（`undefined`）ため問題にならないが、将来的に `useMemo` でのメモ化が必要になる可能性がある。現時点では YAGNI として対処しない。

## D3: CSS キーフレーム

### `globals.css` に追加

```css
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
}

@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-up {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
```

### 設計判断

- **`translateY(24px)`**: `--spacing: 1px` なので、Tailwind の `translate-y-24` と一致。十分な移動量で視認性あり
- **`0.5s ease-out`**: 素早い出現。ease-out は「減速して止まる」自然な動き
- **`forwards`**: アニメーション終了後に最終状態（opacity: 1, translateY: 0）を維持
- **`prefers-reduced-motion`**: アニメーションを完全に無効化し、即座に表示。a11y 必須要件
- **CLS ゼロ**: `opacity` と `transform` のみ使用。これらはコンポジターレイヤーで処理されレイアウトに影響しない

### Tailwind v4 `@theme` との関係

keyframes は `@theme` ブロックの外に定義する。`@theme` はデザイントークン用であり、keyframes/utility class は通常の CSS として記述する。

## D4: `AnimateOnScroll` ラッパーコンポーネント

### ファイル: `src/components/ui/AnimateOnScroll.tsx`

```tsx
'use client';

import { useInView } from '@/hooks/useInView';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function AnimateOnScroll({ children, delay = 0, className = '' }: AnimateOnScrollProps) {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={`${isInView ? 'animate-fade-in-up' : 'opacity-0'} ${className}`}
      style={delay > 0 ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
```

### 設計判断

- **`'use client'`**: IntersectionObserver は ブラウザ API。ページ自体は Server Component のまま
- **`delay` prop**: スタガードディレイ用。`style` で `animationDelay` を設定
- **`className` prop**: 追加クラスの注入を可能に（レイアウト調整用）
- **初期状態 `opacity-0`**: アニメーション前は非表示。`isInView` が true になったら `animate-fade-in-up` を適用
- **`delay > 0` の条件チェック**: delay=0 のときは `style` 属性自体を出力しない（不要な DOM 属性を避ける）
- **ラッパー `<div>`**: セマンティクスに影響しない中立的な要素。`<section>` 等のランドマーク要素はページ側が管理

## D5: 各ページへの適用パターン

### 基本パターン: セクション見出し

```tsx
<AnimateOnScroll>
  <h2 className="text-section-heading text-vercel-black">Section Title</h2>
</AnimateOnScroll>
```

### 基本パターン: カードグリッド（スタガードディレイ）

```tsx
<div className="grid gap-32 md:grid-cols-2">
  {items.map((item, index) => (
    <AnimateOnScroll key={item.id} delay={index * 100}>
      <CardComponent {...item} />
    </AnimateOnScroll>
  ))}
</div>
```

### ページ別の適用箇所

| ページ | 適用箇所 | ディレイ |
|--------|---------|---------|
| Home | HeroSection 全体 | 0ms |
| Home | StrengthCard × 3 | index × 100ms |
| About | ページ見出し（h1 + p） | 0ms |
| About | Career セクション見出し + Timeline | 0ms |
| About | Skills セクション見出し + SkillGrid | 0ms |
| About | Education セクション見出し + リスト | 0ms |
| Projects | ページ見出し | 0ms |
| Projects | ProjectCard × N | index × 100ms |
| Blog | ページ見出し | 0ms |
| Blog | BlogCard × N | index × 100ms |
| Contact | ページ見出し | 0ms |
| Contact | SocialLinkCard × N | index × 100ms |

### Home ページの特殊対応

HeroSection はページ上端に位置するため、初回ロード時に即座にビューポート内にある。IntersectionObserver は初回も発火するため、特別な対応は不要。ただし Hero は他セクションと異なり見出し + CTA の複合要素なので、セクション全体を 1 つの `AnimateOnScroll` でラップする。

### Home ページの `<li>` 構造との適合

Home ページの StrengthCard は `<ul>` > `<li>` 構造で並んでいる。`AnimateOnScroll` は `<li>` の中に挿入する:

```tsx
<ul className="grid gap-32 md:grid-cols-2 lg:grid-cols-3">
  {author.strengths.map((strength, index) => (
    <li key={strength.title}>
      <AnimateOnScroll delay={index * 100}>
        <StrengthCard {...strength} />
      </AnimateOnScroll>
    </li>
  ))}
</ul>
```

`<li>` を `AnimateOnScroll` で置き換えない — セマンティクス（リスト構造）はページ側が管理する原則を維持。

### `prefers-reduced-motion` と `opacity-0` の詳細度

`AnimateOnScroll` は `isInView` が `false` のとき `opacity-0` クラス、`true` のとき `animate-fade-in-up` クラスを適用する。これらは排他的（同時に適用されない）なため、CSS 詳細度の競合は発生しない。`prefers-reduced-motion: reduce` 環境では `animate-fade-in-up` の `animation: none; opacity: 1;` が適用され、コンテンツは即座に表示される。

## D6: テスト戦略

### `useInView` フックのテスト

`IntersectionObserver` は jsdom に存在しないため、テストではモックが必要。

```ts
// IntersectionObserver モック
const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

beforeAll(() => {
  global.IntersectionObserver = vi.fn((callback) => ({
    observe: mockObserve,
    unobserve: mockUnobserve,
    disconnect: mockDisconnect,
    // callback をキャプチャして手動トリガー可能に
  }));
});
```

### `AnimateOnScroll` コンポーネントのテスト

1. 初期状態: `opacity-0` クラスが適用されている
2. IntersectionObserver コールバック発火後: `animate-fade-in-up` クラスが適用されている
3. `delay` prop: `animationDelay` スタイルが設定されている

### ページテストへの影響

既存のページテストは AnimateOnScroll ラッパーの追加で壊れない。ラッパーは透過的な `<div>` であり、`getByRole` や `getByText` クエリに影響しない。ただし `getAllByRole('article')` のような構造依存テストは、ラッパー div が挿入されることで DOM 構造が変わる可能性がある。事前にテスト実行して確認する。

## D7: 変更対象ファイル一覧

| ファイル | 変更内容 | 新規/変更 |
|---------|---------|----------|
| `src/hooks/useInView.ts` | IntersectionObserver フック | 新規 |
| `src/components/ui/AnimateOnScroll.tsx` | ラッパーコンポーネント | 新規 |
| `src/app/globals.css` | @keyframes fade-in-up + reduced-motion | 変更 |
| `src/app/page.tsx` | Hero + StrengthCard にアニメーション | 変更 |
| `src/app/about/page.tsx` | 各セクションにアニメーション | 変更 |
| `src/app/projects/page.tsx` | 見出し + カードにアニメーション | 変更 |
| `src/app/blog/page.tsx` | 見出し + カードにアニメーション | 変更 |
| `src/app/contact/page.tsx` | 見出し + カードにアニメーション | 変更 |
| `__tests__/hooks/useInView.test.ts` | フックの単体テスト | 新規 |
| `__tests__/components/ui/AnimateOnScroll.test.tsx` | コンポーネントテスト | 新規 |
