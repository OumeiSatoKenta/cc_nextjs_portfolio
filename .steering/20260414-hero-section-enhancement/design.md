# Design: ヒーローセクション強化

## D1: グラデーション背景の実装方針

CSS クラス `.hero-gradient` を `globals.css` に追加する。`radial-gradient` で Develop Blue → Preview Pink → Ship Red → transparent のグラデーションを極低不透明度で描画する。

```css
.hero-gradient {
  background: radial-gradient(
    ellipse at 50% 0%,
    rgba(10, 114, 239, 0.06) 0%,
    rgba(222, 29, 141, 0.04) 40%,
    rgba(255, 91, 79, 0.02) 70%,
    transparent 100%
  );
}
```

**判断理由**: Tailwind v4 の `@theme` ブロックはデザイントークン用であり、ユーティリティクラスは `@theme` の外に記述する（Phase 3 と同じパターン）。`radial-gradient` は Tailwind のクラスで表現すると冗長になるため、カスタム CSS クラスが適切。

**Workflow Accent Colors の例外適用**: `development-guidelines.md` では「StrengthCard のアクセントとしてのみ使用。装飾目的は禁止」と規定している。しかし DESIGN.md §6「Decorative Depth」に「Hero gradient: soft, pastel multi-color gradient wash behind hero content (barely visible, atmospheric)」と明記されており、ヒーローグラデーションはデザインシステムが定義する正当な用途である。不透明度 2〜6% の極低コントラストで使用し、テキストの読みやすさに影響しない。実装時に `development-guidelines.md` のルールも更新して「ヒーログラデーション（極低不透明度）も許可」を追記する。

## D2: HeroSection コンポーネントの変更

### Props の拡張

```ts
interface HeroSectionProps {
  name: string;
  tagline: string;
  stats: { label: string; value: string }[];  // 新規追加
}
```

### レイアウト構造

```
<section .hero-gradient>
  <h1>name</h1>
  <p>tagline</p>
  <div .flex .gap-16>            ← CTA グループ
    <Link>Projects を見る</Link>  ← 既存ダーク CTA
    <Link>About を見る</Link>     ← 新規ゴースト CTA
  </div>
  <div .flex .gap-32 .mt-32>     ← 統計カードグループ
    {stats.map(stat => ...)}
  </div>
</section>
```

### セカンダリ CTA スタイリング

DESIGN.md §4「Primary White (Shadow-bordered)」に準拠:
- `bg-pure-white text-vercel-black`
- `shadow-light-ring`（`rgb(235, 235, 235) 0px 0px 0px 1px`）
- `rounded-standard`（6px）
- `hover:shadow-ring` でホバー時にシャドウを強化（DESIGN.md §4 の Primary White は `hover: background shifts to dark` を定義しているが、セカンダリ CTA として既存ダーク CTA との差別化を維持するため、背景の反転は採用せずシャドウ強化のみとする）
- `focus-visible:shadow-focus focus-visible:outline-none` で既存 CTA と統一

```tsx
<Link
  href="/about/"
  className="inline-flex items-center rounded-standard bg-pure-white px-16 py-10 text-button-link text-vercel-black shadow-light-ring transition-shadow hover:shadow-ring focus-visible:shadow-focus focus-visible:outline-none"
>
  About を見る
</Link>
```

### 統計カード スタイリング

DESIGN.md §4「Metric Cards」に準拠:
- 数値: `text-section-heading text-vercel-black`（40px, weight 600。DESIGN.md §4 Metric Cards は 48px を定義しているが、ヒーロー内では h1(48px) と競合するため 40px に縮小）
- ラベル: `text-caption text-gray-500`（12px）
- コンテナ: セパレータなし、flexbox で水平配置
- `font-feature-settings: "tnum"` を数値に適用（DESIGN.md §3: tabular numbers for captions）

レスポンシブ対応: モバイルでは `gap-16`、md 以上で `gap-32` とし overflow を防止する。

```tsx
<dl className="mt-32 flex gap-16 md:gap-32">
  {stats.map((stat) => (
    <div key={stat.label} className="text-center">
      <dt className="text-caption text-gray-500">{stat.label}</dt>
      <dd className="text-section-heading text-vercel-black" style={{ fontFeatureSettings: '"tnum"' }}>
        {stat.value}
      </dd>
    </div>
  ))}
</dl>
```

**セマンティクス**: `<dl>` + `<dt>` + `<dd>` を使用する。統計データは「用語 + 定義」のペアであり、definition list が最も適切。スクリーンリーダーがラベルと値の関係を正しく伝えられる。

## D3: page.tsx の変更

`siteMetadata.author.stats` を `HeroSection` に渡す:

```tsx
<HeroSection
  name={author.name}
  tagline={author.tagline}
  stats={author.stats}
/>
```

## D4: テスト戦略

### 既存テストへの影響

- `renders the author name as the h1 heading` → 影響なし
- `renders the tagline` → 影響なし
- `renders one StrengthCard article per strength` → 影響なし
- `renders each strength title as an h3 heading` → 影響なし
- `renders a CTA link to /projects/` → 影響なし

### 新規テストケース

1. `'renders each stat value from siteMetadata.author.stats'` — `siteMetadata.author.stats` の各 `value` がレンダリングされること
2. `'renders a secondary CTA link to /about/'` — `About を見る` リンクが `/about/` を指していること

## D5: ファイル変更一覧

| ファイル | 変更種別 | 内容 |
|---------|---------|------|
| `src/app/globals.css` | 変更 | `.hero-gradient` クラス追加 |
| `src/components/home/HeroSection.tsx` | 変更 | props 拡張、グラデーション、統計、セカンダリ CTA |
| `src/app/page.tsx` | 変更 | `stats` prop を HeroSection に渡す |
| `__tests__/app/page.test.tsx` | 変更 | 統計値・セカンダリ CTA のテストケース追加 |
| `docs/development-guidelines.md` | 変更 | Workflow Accent Colors ルールにヒーログラデーション例外を追記 |
