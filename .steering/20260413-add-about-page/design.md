# 設計: About ページ（経歴タイムライン・スキル一覧）

## 設計方針

1. **サーバーコンポーネント優先**: Timeline / TimelineItem / SkillGrid は純粋なプレゼンテーション。`'use client'` 不要。
2. **データフロー**: `src/data/` の career / skills / education を about/page.tsx が import し、各コンポーネントへ props で渡す。
3. **スタイリング**: `tailwind.config.ts` の既存トークンのみ使用。任意値（`[#xxx]`）は禁止。
4. **構造的合意**: セマンティック要素（`<section>`, `<article>`, `<h1>`, `<h2>`, `<h3>`, `<time>`）を適切に使用。
5. **テスト**: コンポーネント境界で単体、ページ統合で結合の 2 層。
6. **既存パターン踏襲**: F1 (HeroSection / StrengthCard) の命名・配置・Props 設計に合わせる。

## ファイル構成

```
src/
├── app/
│   └── about/page.tsx              # 修正（プレースホルダ→実装）
├── components/
│   └── about/                      # 新規ディレクトリ
│       ├── Timeline.tsx            # 新規
│       ├── TimelineItem.tsx        # 新規
│       └── SkillGrid.tsx           # 新規
├── data/
│   ├── career.ts                   # 新規
│   ├── skills.ts                   # 新規
│   └── education.ts                # 新規
└── types/
    └── index.ts                    # 修正（Career / Skill / Education 型追加）

__tests__/
├── app/
│   └── about/page.test.tsx         # 新規
└── components/
    └── about/                      # 新規ディレクトリ
        ├── Timeline.test.tsx       # 新規
        ├── TimelineItem.test.tsx   # 新規
        └── SkillGrid.test.tsx      # 新規
```

## 型定義（src/types/index.ts に追加）

```typescript
export interface Career {
  company: string;
  role: string;
  period: {
    start: string;   // "2026-02" 形式
    end?: string;     // 在籍中は undefined
  };
  description: string;
  achievements: string[];
  technologies?: string[];
}

export type SkillCategory = 'cloud' | 'language' | 'database' | 'tool';

export type SkillLevel = 'expert' | 'advanced' | 'intermediate' | 'beginner';

export interface Skill {
  name: string;
  category: SkillCategory;
  level?: SkillLevel;
}

export interface Education {
  type: 'certification' | 'degree';
  title: string;
  institution?: string;
  date: string;        // "2024-03" 形式
  description?: string;
}
```

### SkillCategory マッピング（メモリ→型）

> **functional-design.md との差分**: functional-design.md は 6 値（`language | framework | cloud | tool | database | other`）を定義しているが、本実装では職務経歴書のスキル表に合わせて MVP 対象の 4 値に絞っている。`framework` と `other` は現在のデータに該当がないため除外。後続でデータが追加される場合は型を拡張する。

| メモリのカテゴリ名 | SkillCategory | 表示ラベル |
|---|---|---|
| クラウド / IaC | `'cloud'` | Cloud / IaC |
| 言語 | `'language'` | Languages |
| DB / キャッシュ | `'database'` | Database |
| 開発基盤 | `'tool'` | DevOps / Tools |

### SkillLevel マッピング（メモリ→型）

| メモリのレベル | SkillLevel |
|---|---|
| S | `'expert'` |
| A | `'advanced'` |
| B | `'intermediate'` |
| C | `'beginner'` |

## コンポーネント詳細

### TimelineItem

```typescript
// src/components/about/TimelineItem.tsx

interface TimelineItemProps {
  company: string;
  role: string;
  period: { start: string; end?: string };
  description: string;
  achievements: string[];
  technologies?: string[];
  isLast: boolean;
}
```

**レイアウト**:
- 左側: 縦線（`border-l-2 border-gray-100`）+ ドット（`w-3 h-3 rounded-circle bg-vercel-black`）
- 右側: コンテンツ
  - 会社名: `text-card-title text-vercel-black`
  - 在籍期間: `font-geist-mono text-caption text-gray-500 uppercase`、`<time>` 要素
  - 役割: `text-body-medium text-gray-600`
  - 業務概要: `text-body-small text-gray-600`
  - 成果: `<ul>` + `<li>` リスト、`text-body-small text-gray-600`
  - 技術タグ: Pill Badge（`rounded-pill bg-badge-blue-bg text-badge-blue-text text-caption`）
- `isLast` が true の場合、縦線を途中で止める

**設計判断**:
- Career オブジェクト全体ではなく、個別 prop として分解して渡す（F1 StrengthCard と同パターン）。functional-design.md では `career: Career` を直接渡す設計だが、F1 で確立した分解渡しパターンに統一する（テスト容易性・再利用性）
- `<time>` 要素で在籍期間をマシンリーダブルに
- 技術タグは DESIGN.md の Pill Badge スタイルを使用
- 縦線 + ドットはCSSで実装（SVG不要）

### Timeline

```typescript
// src/components/about/Timeline.tsx

interface TimelineProps {
  careers: Career[];
}
```

**責務**: Career 配列を受け取り、TimelineItem を列挙。最後の要素に `isLast={true}` を渡す。

### SkillGrid

```typescript
// src/components/about/SkillGrid.tsx

interface SkillGridProps {
  skills: Skill[];
}
```

**レイアウト**:
- カテゴリごとにグループ化して表示
- カテゴリ見出し: `text-card-title-light text-vercel-black`
- スキルバッジ: Pill Badge（`rounded-pill bg-badge-blue-bg text-badge-blue-text text-caption px-10 py-3`）
  - level が `'expert'` の場合: `bg-vercel-black text-pure-white` で視覚的に差別化
  - level が `'advanced'` の場合: `bg-gray-100 text-vercel-black`
  - level が `'intermediate'` 以下: デフォルト `bg-badge-blue-bg text-badge-blue-text`
- グリッド: `grid gap-32 md:grid-cols-2`（カテゴリごとに 1 セル）

**設計判断**:
- カテゴリ表示ラベルは定数マップ `CATEGORY_LABEL` で管理
- レベル別バッジスタイルは定数マップ `LEVEL_BADGE_CLASS` で管理（JIT 対応、F1 ACCENT_BAR_CLASS と同パターン）
- カテゴリの表示順序は定数配列 `CATEGORY_ORDER` で定義

### about/page.tsx（統合）

```typescript
// src/app/about/page.tsx
import { Timeline } from '@/components/about/Timeline';
import { SkillGrid } from '@/components/about/SkillGrid';
import { careers } from '@/data/career';
import { skills } from '@/data/skills';
import { educations } from '@/data/education';

export default function AboutPage() {
  return (
    <>
      <section
        className="mx-auto max-w-[1200px] px-16 py-40 md:px-32"
        aria-label="経歴"
      >
        <h1 className="text-display-hero text-vercel-black">About</h1>
        <p className="mt-16 text-body-large text-gray-600">
          経歴とスキルセット
        </p>
      </section>

      <section
        className="mx-auto max-w-[1200px] px-16 pb-40 md:px-32"
        aria-label="職務経歴"
      >
        <h2 className="text-section-heading text-vercel-black">Career</h2>
        <div className="mt-32">
          <Timeline careers={careers} />
        </div>
      </section>

      <section
        className="mx-auto max-w-[1200px] px-16 pb-40 md:px-32"
        aria-label="スキル"
      >
        <h2 className="text-section-heading text-vercel-black">Skills</h2>
        <div className="mt-32">
          <SkillGrid skills={skills} />
        </div>
      </section>

      <section
        className="mx-auto max-w-[1200px] px-16 pb-40 md:px-32"
        aria-label="学歴・資格"
      >
        <h2 className="text-section-heading text-vercel-black">Education</h2>
        <ul className="mt-32 flex flex-col gap-16">
          {educations.map((edu) => (
            <li
              key={`${edu.type}-${edu.title}`}
              className="rounded-comfortable bg-pure-white p-32 shadow-subtle-card"
            >
              <h3 className="text-card-title text-vercel-black">{edu.title}</h3>
              {edu.institution && (
                <p className="mt-8 text-body-small text-gray-600">
                  {edu.institution}
                </p>
              )}
              <time className="mt-4 block font-geist-mono text-caption text-gray-500">
                {edu.date}
              </time>
              {edu.description && (
                <p className="mt-8 text-body-small text-gray-600">
                  {edu.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
```

**設計判断**:
- ページ内の見出し階層: `<h1>` About → `<h2>` Career / Skills / Education → `<h3>` 各項目
- Education セクションはデータ量が少ないため、専用コンポーネントではなくページ内に直接記述（資格データが 3 件超になった場合は EducationCard コンポーネントへの切り出しを検討）
- 各セクションに `aria-label` を付与（F1 と同パターン）

## データ定義

### career.ts

メモリの 5 件の職歴サマリを新しい順に定義。各エントリに company / role / period / description / achievements / technologies を含む。

### skills.ts

メモリのスキル表 4 カテゴリをフラットな配列として定義。各エントリに name / category / level を含む。

### education.ts

```typescript
export const educations: Education[] = [
  {
    type: 'degree',
    title: '博士課程後期 満期退学',
    institution: '名古屋大学 大学院',
    date: '2021-03',
  },
];
```

資格データは情報が不足しているため空配列 or 上記のみ。ユーザーが後で追加可能。

## テスト設計

### TimelineItem.test.tsx

| 観点 | 検証内容 |
|---|---|
| 会社名の表示 | `company` が heading として表示される |
| 在籍期間の表示 | `period` が `<time>` 要素として表示される |
| 役割の表示 | `role` がテキストとして表示される |
| 成果の表示 | `achievements` がリストアイテムとして表示される |
| 技術タグの表示 | `technologies` がバッジとして表示される |
| isLast=false | 縦線が表示される |
| isLast=true | 縦線が途中で止まる |

### Timeline.test.tsx

| 観点 | 検証内容 |
|---|---|
| 複数件表示 | Career 配列の件数分の TimelineItem がレンダリングされる |
| 最後の要素 | 最後の項目のみ isLast が適用される |

### SkillGrid.test.tsx

| 観点 | 検証内容 |
|---|---|
| カテゴリ見出し | 4 カテゴリの見出しが表示される |
| スキル名の表示 | 各スキル名がテキストとして表示される |
| expert バッジ | expert レベルのスキルに dark バッジクラスが付与される |

### about/page.test.tsx

| 観点 | 検証内容 |
|---|---|
| h1 の表示 | "About" が h1 として表示される |
| Career セクション | h2 "Career" が表示される |
| Skills セクション | h2 "Skills" が表示される |
| Education セクション | h2 "Education" が表示される |
| データ連動 | career データの会社名が表示される |
| データ連動 | skills データのスキル名が表示される |

## デザイントークン対応関係

| DESIGN.md / functional-design.md の呼称 | 本実装で使用する Tailwind トークン | 根拠 |
|---|---|---|
| Section Heading | `text-section-heading` | tailwind.config.ts `fontSize.section-heading`（Geist 40px / 600 / -2.4px） |
| Card Title | `text-card-title` | tailwind.config.ts `fontSize.card-title`（Geist 24px / 600 / -0.96px） |
| Card Title Light | `text-card-title-light` | tailwind.config.ts `fontSize.card-title-light`（Geist 24px / 500 / -0.96px） |
| Caption (Mono) | `font-geist-mono text-caption` | tailwind.config.ts `fontSize.caption`（12px / 1.33） |
| Pill Badge | `rounded-pill bg-badge-blue-bg text-badge-blue-text text-caption` | DESIGN.md §Pill Button / Badge |
| Subtle Card shadow | `shadow-subtle-card` | tailwind.config.ts `boxShadow.subtle-card` |
| Shadow-as-border (timeline line) | `border-gray-100` | DESIGN.md §Neutral Scale Gray 100 |

## 既存パターンとの整合性チェック

| 項目 | 既存パターン | 本設計 |
|---|---|---|
| コンポーネント配置 | `src/components/home/` | `src/components/about/` ✅ |
| named export | HeroSection / StrengthCard | Timeline / TimelineItem / SkillGrid ✅ |
| Props 型定義 | コンポーネント同ファイル | 同ファイル ✅ |
| Tailwind トークン | `tailwind.config.ts` 定義 | 既存トークンのみ ✅ |
| テスト配置 | `__tests__/components/home/*.test.tsx` | `__tests__/components/about/*.test.tsx` ✅ |
| テスト書式 | RTL + `screen.getByRole` | 同じ ✅ |
| データ配置 | `src/data/metadata.ts` | `src/data/career.ts` / `skills.ts` / `education.ts` ✅ |

## リスクと対策

| リスク | 対策 |
|---|---|
| Tailwind JIT が動的バッジクラスを検出できない | `LEVEL_BADGE_CLASS` / `CATEGORY_LABEL` マップで静的クラスを使用 |
| 在籍期間の「現在」表示 | `end` が undefined の場合 "現在" を表示するロジックを TimelineItem 内に実装 |
| 資格データが空 | Education セクションは空配列でも正常表示（条件付きレンダリング or 学歴のみ表示） |
| PII 漏洩 | データファイルの値はメモリの「公開 OK」範囲のみ使用。コミット前に確認 |
