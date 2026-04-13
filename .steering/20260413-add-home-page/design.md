# 設計: トップページ（HeroSection・StrengthCard）

## 設計方針

1. **サーバーコンポーネント優先**: HeroSection / StrengthCard は純粋なプレゼンテーション。`'use client'` は付与しない。
2. **データフロー**: `siteMetadata` をトップページが読み込み、各コンポーネントへ props として渡す。
3. **スタイリング**: `tailwind.config.ts` の既存トークンのみ使用。任意値（`[#xxx]`）は禁止。
4. **構造的合意**: セマンティック要素（`<section>`, `<article>`, `<h1>`, `<h3>`）を適切に使用。
5. **テスト**: コンポーネント境界で単体、ページ統合で結合の 2 層。

## ファイル構成

新規追加:
```
src/
├── app/
│   └── page.tsx                    # 修正（プレースホルダ削除 → 実装）
└── components/
    └── home/                       # 新規ディレクトリ
        ├── HeroSection.tsx         # 新規
        └── StrengthCard.tsx        # 新規

src/data/
└── metadata.ts                     # 修正（tagline + strengths.description 拡充）

__tests__/
├── app/
│   └── page.test.tsx               # 新規
└── components/
    └── home/                       # 新規ディレクトリ
        ├── HeroSection.test.tsx    # 新規
        └── StrengthCard.test.tsx   # 新規
```

## コンポーネント詳細

### HeroSection

```typescript
// src/components/home/HeroSection.tsx
import Link from 'next/link';

interface HeroSectionProps {
  name: string;
  tagline: string;
}

export function HeroSection({ name, tagline }: HeroSectionProps) {
  return (
    <section className="mx-auto flex max-w-[1200px] flex-col items-center px-16 py-40 text-center md:px-32 md:py-40">
      <h1 className="text-display-hero text-vercel-black">{name}</h1>
      <p className="mt-16 text-body-large text-gray-600">{tagline}</p>
      <Link
        href="/projects/"
        className="mt-32 inline-flex items-center rounded-standard bg-vercel-black px-16 py-10 text-button-link text-pure-white transition-opacity hover:opacity-85 focus-visible:shadow-focus focus-visible:outline-none"
      >
        Projects を見る
      </Link>
    </section>
  );
}
```

**設計判断**:
- 見出しは `<h1>` — ページ内で唯一のトップヘッディング。
- CTA ボタンは Next.js `<Link>` で client-side navigation（`/projects/` と trailingSlash）。
- `trailingSlash: true`（next.config.js）に合わせて URL 末尾スラッシュあり。
- Primary Dark ボタン（DESIGN.md）: 背景 `bg-vercel-black`、テキスト `text-pure-white`、角丸 `rounded-standard` (6px)、パディング 16x10。
- ホバー: `hover:opacity-85`（DESIGN.md Primary ボタン準拠）。
- フォーカス: `focus-visible:shadow-focus` で青フォーカスリング（既存 `shadow-focus` トークン）。
- 中央寄せ: `flex flex-col items-center text-center`。
- 外側マージン: `mx-auto max-w-[1200px]` で中央配置 + 最大幅（`max-w-[1200px]` は既存 Header と統一、任意値扱いだが Header でも使用済みのため準拠）。

### StrengthCard

```typescript
// src/components/home/StrengthCard.tsx
import type { Strength } from '@/types';

type AccentColor = Strength['accentColor'];

interface StrengthCardProps {
  title: string;
  description: string;
  accentColor: AccentColor;
}

const ACCENT_BAR_CLASS: Record<AccentColor, string> = {
  ship: 'bg-ship-red',
  preview: 'bg-preview-pink',
  develop: 'bg-develop-blue',
};

export function StrengthCard({ title, description, accentColor }: StrengthCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-comfortable bg-pure-white shadow-subtle-card">
      <div className={`h-4 ${ACCENT_BAR_CLASS[accentColor]}`} aria-hidden="true" />
      <div className="flex flex-col gap-12 p-32">
        <h3 className="text-card-title text-vercel-black">{title}</h3>
        <p className="text-body-small text-gray-600">{description}</p>
      </div>
    </article>
  );
}
```

**設計判断**:
- `ACCENT_BAR_CLASS` は**コンポーネント外モジュールスコープの定数**として定義。Tailwind JIT が静的解析できるようクラス文字列は完全形で記述（動的補間 `bg-${accentColor}` は不可）。
- アクセントバー `h-4` = 4px（既存 spacing トークン）。`overflow-hidden` + `rounded-comfortable` でカードの角丸からバーがはみ出ない。
- パディング `p-32` = 32px（既存 spacing）。要素間ギャップ `gap-12` = 12px。
- `aria-hidden="true"` で装飾要素をスクリーンリーダから隠す。
- Strength 型の `accentColor` を再利用することで型の一貫性を担保。

### app/page.tsx（統合）

```typescript
// src/app/page.tsx
import { HeroSection } from '@/components/home/HeroSection';
import { StrengthCard } from '@/components/home/StrengthCard';
import { siteMetadata } from '@/data/metadata';

export default function HomePage() {
  const { author } = siteMetadata;

  return (
    <>
      <HeroSection name={author.name} tagline={author.tagline} />
      <section
        className="mx-auto max-w-[1200px] px-16 pb-40 md:px-32"
        aria-label="強み"
      >
        <ul className="grid gap-32 md:grid-cols-2 lg:grid-cols-3">
          {author.strengths.map((strength) => (
            <li key={strength.title}>
              <StrengthCard
                title={strength.title}
                description={strength.description}
                accentColor={strength.accentColor}
              />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
```

**設計判断**:
- 強みセクションは `<section aria-label="強み">` で意味付け。見出しはヒーローの `<h1>` と強みカードの `<h3>` だけで構成し、強みセクション自体に `<h2>` を置かない（PRD F1 の UX は「カード即表示」で、セクションタイトル不要）。
- リストマークアップ: `<ul>` + `<li>` で 3 つの強みを列挙（スクリーンリーダ向けの構造）。
- グリッド: `grid gap-32 md:grid-cols-2 lg:grid-cols-3` でレスポンシブ（Tailwind デフォルトブレークポイント）。
- Strength オブジェクト全体ではなく、個別 prop として分解して渡す（再利用性 / テスト容易性）。

## データ定義変更（metadata.ts）

```typescript
// src/data/metadata.ts（抜粋）
export const siteMetadata: SiteMetadata = {
  // ... name は "Your Name" のまま（PII 禁止ルール）
  author: {
    name: 'Your Name',
    tagline: 'SRE Engineer — Multi-Cloud · IaC · AI-Driven Development',
    strengths: [
      {
        title: 'マルチクラウド',
        description:
          'AWS・Google Cloud の両クラウドで Terraform / Terragrunt による IaC 設計・構築・運用を実務で担当しています。',
        accentColor: 'develop',
      },
      {
        title: 'AI駆動開発',
        description:
          'Claude Code の導入を複数プロジェクトで主導。Skills・Agents・MCP 連携によるコードレビュー自動化と設計書生成を実践しています。',
        accentColor: 'preview',
      },
      {
        title: 'パフォーマンス改善',
        description:
          '負荷試験の設計・実施からボトルネック特定、DB インデックス・スロークエリ改善、コスト最適化まで定量的な成果を積み上げています。',
        accentColor: 'ship',
      },
    ],
  },
};
```

## テスト設計

### HeroSection.test.tsx

| 観点 | 検証内容 |
|---|---|
| 名前の表示 | `name` が `<h1>` 要素として表示される |
| 肩書きの表示 | `tagline` がテキストとして表示される |
| CTA リンク | 「Projects を見る」が `/projects/` へのリンクとして存在 |
| アクセシビリティ | `<section>` でラップされている |

### StrengthCard.test.tsx

| 観点 | 検証内容 |
|---|---|
| タイトル表示 | `title` が `<h3>` として表示される |
| 説明表示 | `description` がテキストとして表示される |
| accentColor: ship | アクセントバーに `bg-ship-red` クラスが付与される |
| accentColor: preview | アクセントバーに `bg-preview-pink` クラスが付与される |
| accentColor: develop | アクセントバーに `bg-develop-blue` クラスが付与される |
| 装飾要素 | アクセントバーに `aria-hidden="true"` が付与される |

### page.test.tsx

| 観点 | 検証内容 |
|---|---|
| ヒーロー統合 | `siteMetadata.author.name` が `<h1>` に表示される |
| 強み 3 枚 | 3 つの StrengthCard がレンダリングされる（`<article>` を 3 件検証） |
| データ連動 | `siteMetadata.author.strengths` の各タイトルが表示される |

## 既存パターンとの整合性チェック

| 項目 | 既存パターン | 本設計 |
|---|---|---|
| コンポーネント配置 | `src/components/layout/Header.tsx` | `src/components/home/HeroSection.tsx` ✅ |
| named export | Header / Footer / Navigation | HeroSection / StrengthCard ✅ |
| Props 型定義 | コンポーネント同ファイル | 同ファイル ✅ |
| Tailwind トークン | `tailwind.config.ts` 定義 | 既存トークンのみ ✅ |
| テスト配置 | `__tests__/components/layout/*.test.tsx` | `__tests__/components/home/*.test.tsx` ✅ |
| テスト書式 | RTL + `screen.getByRole` | 同じ ✅ |

## デザイントークン対応関係

| DESIGN.md / functional-design.md の呼称 | 本実装で使用する Tailwind トークン | 根拠 |
|---|---|---|
| Card Stack shadow | `shadow-subtle-card` | `tailwind.config.ts` に定義済の「Vercel 風 Subtle Card shadow」。functional-design.md の "Card Stack" は Vercel デザインシステム用語で、同トークンに相当 |
| Primary Dark Button | `bg-vercel-black` + `text-pure-white` + `rounded-standard` + `hover:opacity-85` + `focus-visible:shadow-focus` | DESIGN.md §Primary Button (Dark) |
| Display Hero | `text-display-hero` | tailwind.config.ts `fontSize.display-hero`（Geist 48px / 600 / -2.4px） |
| Card Title | `text-card-title` | tailwind.config.ts `fontSize.card-title`（Geist 24px / 600 / -0.96px） |

## リスクと対策

| リスク | 対策 |
|---|---|
| Tailwind JIT が動的クラス `bg-${accentColor}` を検出できない | `ACCENT_BAR_CLASS` マップで静的クラスを使用 |
| `trailingSlash: true` と CTA リンクの整合 | `/projects/` と末尾スラッシュ付きで指定 |
| `<h1>` が重複する可能性 | layout.tsx には見出しがないため HomePage の `<h1>` が唯一。Header の siteName は `<Link>` 内の通常テキスト |
| Static Export でのリンク挙動 | Next.js `<Link>` + trailingSlash で生成 HTML は `/projects/index.html` を参照。出力検証は CI の `verify` ステップで既にカバー |

## 実装順序（task 粒度）

1. metadata.ts の tagline と strengths.description を更新（データ先行）
2. StrengthCard コンポーネント実装（最小単位から）
3. StrengthCard のテスト作成
4. HeroSection コンポーネント実装
5. HeroSection のテスト作成
6. app/page.tsx の統合実装
7. page.test.tsx の統合テスト作成
8. `npm run lint` / `type-check` / `test` / `build` を通す
9. `npm run dev` で目視確認
