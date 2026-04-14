# Requirements: ヒーローセクション強化

## R1: 淡いグラデーション背景

HeroSection の背景に、DESIGN.md §6「装飾的深度: ヒーローコンテンツ背景の淡いパステルマルチカラーグラデーション」で定義されている淡いグラデーションを適用する。ワークフローアクセントカラー（Develop Blue, Preview Pink, Ship Red）を極低不透明度で使用し、大気的な効果を演出する。

## R2: ヒーロー統計カード

HeroSection 内に統計情報（stats）を表示する。`siteMetadata.author.stats` 配列（Phase 1 で追加済み）を使用し、数値を大きく表示してラベルを添える形にする。DESIGN.md §4「Metric Cards」のスタイリングに従う。

## R3: セカンダリ CTA

既存のダーク CTA「Projects を見る」の隣に、ゴースト（アウトライン）スタイルの「About を見る」ボタンを追加する。DESIGN.md §4「Primary White (Shadow-bordered)」のスタイリングに準拠する。

## R4: 既存レイアウト維持

変更はヒーローセクション内に限定する。ページ全体のレイアウト、他コンポーネントへの影響を発生させない。

## R5: Server Component 互換

`page.tsx` は Server Component のまま維持する。HeroSection は純粋なプレゼンテーションコンポーネントであり、クライアントサイド JavaScript を必要としない。

## R6: テスト

既存の `__tests__/app/page.test.tsx` が引き続き全パスすること。新しい統計カード・セカンダリ CTA に対するテストケースを追加する。

## R7: アクセシビリティ

- 統計カード: 適切な aria-label でスクリーンリーダーに数値の意味を伝える
- セカンダリ CTA: `focus-visible` スタイルを既存 CTA と統一
- グラデーション: 装飾的要素のためテキストコントラストに影響しないこと
