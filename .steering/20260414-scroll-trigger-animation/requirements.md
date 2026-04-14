# Requirements: スクロールトリガーアニメーション

## R1: スクロール連動フェードインアニメーション

各ページのセクション見出し・カードグリッドが、ビューポートに入ったタイミングで `fade-in-up`（下から上へフェードイン）アニメーションで表示される。

### 受け入れ条件

- ビューポートに 10% 以上入った時点でアニメーションが発火する
- アニメーションは 1 要素につき 1 回のみ（再スクロールで繰り返さない）
- アニメーション: `opacity: 0 → 1` + `translateY: 24px → 0`
- デュレーション: 500ms、イージング: ease-out

## R2: スタガードディレイ

同一グリッド内の複数カードに段階的な遅延を適用し、「波打つように現れる」視覚効果を実現する。

### 受け入れ条件

- グリッド内の各カードに `index * 100ms` のディレイを適用
- セクション見出しはディレイなし（即座にフェードイン）

## R3: prefers-reduced-motion の尊重

ユーザーが OS 設定で `prefers-reduced-motion: reduce` を有効にしている場合、アニメーションをスキップし即座に表示する。

### 受け入れ条件

- CSS `@media (prefers-reduced-motion: reduce)` でアニメーションを無効化
- アニメーション無効時も内容は正しく表示される

## R4: CLS（Cumulative Layout Shift）ゼロ

アニメーション追加によるレイアウトシフトを発生させない。

### 受け入れ条件

- アニメーション前後で要素のサイズ・レイアウトが変わらない
- `opacity` と `transform` のみを使用（`height`, `margin`, `padding` は変更しない）

## R5: サーバーコンポーネント互換

ページ（`page.tsx`）はサーバーコンポーネントのまま維持する。

### 受け入れ条件

- ページファイルに `'use client'` を追加しない
- アニメーション用のクライアントコンポーネントを子として挿入する形で実現

## R6: バンドルコストゼロ

外部アニメーションライブラリ（Framer Motion 等）を使用しない。

### 受け入れ条件

- CSS keyframes + IntersectionObserver API のみで実装
- `package.json` の dependencies / devDependencies に新規パッケージを追加しない

## R7: 対象ページ

全 5 ページのセクションにアニメーションを適用する。

| ページ | アニメーション対象 |
|--------|------------------|
| Home (`/`) | HeroSection + StrengthCard グリッド |
| About (`/about/`) | 各セクション見出し + Career / Skills / Education |
| Projects (`/projects/`) | 見出し + ProjectCard グリッド |
| Blog (`/blog/`) | 見出し + BlogCard グリッド |
| Contact (`/contact/`) | 見出し + SocialLinkCard グリッド |
