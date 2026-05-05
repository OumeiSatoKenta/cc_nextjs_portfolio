# Step 3: About ページ強化 — 設計

## 設計方針

1. **既存パターン踏襲**: 既存 `<AnimateOnScroll>`, `useInView`, `bg-pure-white` / `bg-gray-50`, バッジトークンを再利用。
2. **client / server 分離の最小化**: スクロール検知・アコーディオン開閉のみ client、表示専用は server。
3. **データ駆動**: 各コンポーネントは props で fixture を受け取り、テスト時に直接渡せる。
4. **アンカーナビゲーション**: HTML 標準の `<a href="#id">` ＋ `scroll-padding-top` でヘッダー被り回避。JS スクロールジャックは導入しない。

## 型拡張

### `src/types/index.ts`

```ts
export interface EducationImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface Education {
  type: 'certification' | 'degree' | 'publication';
  title: string;
  institution?: string;
  date: string;
  description?: string;
  details?: string;          // NEW: アコーディオン展開時の詳細
  images?: EducationImage[]; // NEW: 学術写真
}

export interface PersonalQuality {
  title: string;       // 例: '論理'
  description: string; // 例: '客観的に実現可能性を評価する'
}

export interface PersonalInfo {
  type: string;              // 例: '専門家 × エクスパンダー'
  typeDescription: string;   // 一文の概要
  topQualities: PersonalQuality[];
  selfAwareness: string[];   // 強み・成長領域の箇条書き
}

export interface SiteMetadata {
  // ...既存
  author: {
    // ...既存
    personalInfo?: PersonalInfo; // NEW
  };
}
```

## データ更新

### `src/data/education.ts`

博士課程後期エントリに `details` と `images` を追加:

```ts
{
  type: 'degree',
  title: '博士課程後期 満期退学',
  institution: '名古屋大学 大学院',
  date: '2021-03',
  description: '修士課程では RHICf 実験における...',
  details: 'RHICf 実験は米国ブルックヘブン国立研究所 RHIC で実施された衝突実験で、...（既存 description より詳細な研究紹介）',
  images: [
    {
      src: '/images/projects/collider_experiment_image.png',
      alt: '衝突型加速器実験装置',
      caption: 'RHICf 実験の検出器設置（米国ブルックヘブン国立研究所）',
    },
    {
      src: '/images/projects/cosmic_ray_air_shower.png',
      alt: '宇宙線空気シャワーの図',
      caption: '宇宙線空気シャワーのイメージ図',
    },
  ],
},
```

### `src/data/metadata.ts`

`personalInfo` を追加:

```ts
personalInfo: {
  type: '専門家 × エクスパンダー',
  typeDescription:
    '特定の専門性を内省的に追求し、論理的・分析的に課題の深掘りや原因究明を行うタイプ。安定した環境で結果を着実に積み上げるスタイルが得意。',
  topQualities: [
    {
      title: '論理',
      description: '客観的に実現可能性を評価し、整理・分析の結果から判断する',
    },
    {
      title: '着実',
      description: '粘り強く着実に物事を進め、リスクを回避し安全に進める',
    },
    {
      title: '規律',
      description: 'ルールを決めて公正な環境を作り、管理する仕組みでスムーズに進行する',
    },
  ],
  selfAwareness: [
    '専門性を深く追求し、課題の根本原因を特定するアプローチが得意',
    '安定環境でルールベースに着実に進めるスタイルでチームの信頼を築く',
    '柔軟な対応や社交性は意識的にトレーニング中。レビュー・対話を重視している',
  ],
},
```

## スタイル拡張

### `src/app/globals.css`

```css
/* Header height is shared between scroll-padding-top and StickyNav's top position */
:root {
  --header-height: 56px; /* Header py-12 (24px) + nav link line-height (~32px) */
}

html {
  scroll-padding-top: var(--header-height);
}

/* Smooth scroll for anchor navigation */
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}

/* Accordion animation using grid-template-rows trick */
.accordion-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease-out;
}

.accordion-content[data-state='open'] {
  grid-template-rows: 1fr;
}

.accordion-content > div {
  overflow: hidden;
}

@media (prefers-reduced-motion: reduce) {
  .accordion-content {
    transition: none;
  }
}
```

## フック設計

### `src/hooks/useSectionObserver.ts`

```ts
'use client';

import { useEffect, useState } from 'react';

interface UseSectionObserverOptions {
  sectionIds: string[];
  rootMargin?: string;
}

/**
 * IntersectionObserver でアクティブなセクション ID を返す。
 * 複数のセクションが同時に交差する場合、最も上にあるものを優先する。
 */
export function useSectionObserver({
  sectionIds,
  rootMargin = '-20% 0px -60% 0px',
}: UseSectionObserverOptions): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds, rootMargin]);

  return activeId;
}
```

**ポイント**:
- `rootMargin: '-20% 0px -60% 0px'` でビューポート上 20%〜40% に入ったときアクティブ判定。
- 複数セクション同時交差時は最も上のものを選ぶ。
- jsdom テストでは `vitest.setup.ts` の MockIntersectionObserver により observe は no-op。テストでは `setActiveId` の挙動を検証できないため、サブセット（sectionIds が空のときの early return、初期値 null）のみテスト。

## コンポーネント設計

### `src/components/about/StickyNav.tsx`

```tsx
'use client';

import { useMemo } from 'react';
import { useSectionObserver } from '@/hooks/useSectionObserver';

interface NavItem {
  id: string;
  label: string;
}

interface StickyNavProps {
  items: NavItem[];
}

export function StickyNav({ items }: StickyNavProps) {
  // Memoize sectionIds so useEffect dependency in useSectionObserver doesn't re-fire on each render
  const sectionIds = useMemo(() => items.map((i) => i.id), [items]);
  const activeId = useSectionObserver({ sectionIds });
  // Default to first section so navigation has a "current" state on initial load (before any scroll)
  const currentId = activeId ?? items[0]?.id ?? null;

  return (
    <nav
      aria-label="ページ内ナビゲーション"
      className="sticky top-[var(--header-height)] z-40 bg-pure-white/90 shadow-subtle-card backdrop-blur"
    >
      <div className="mx-auto max-w-[1200px] px-16 md:px-32">
        <ul className="flex gap-16 overflow-x-auto py-8">
          {items.map((item) => {
            const isActive = currentId === item.id;
            return (
              <li key={item.id} className="shrink-0">
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? 'location' : undefined}
                  className={`rounded-pill px-12 py-4 text-button-link transition-colors ${
                    isActive
                      ? 'bg-vercel-black text-pure-white'
                      : 'text-vercel-black hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
```

**ポイント**:
- `top-[56px]` は Header (py-12 + line-height) と整合。`scroll-padding-top` も同値。
- アクティブ時に黒背景 + 白文字で強調（既存ヘッダーリンクと差別化）。

### `src/components/about/EducationAccordion.tsx`

```tsx
'use client';

import Image from 'next/image';
import { useId, useState } from 'react';
import type { Education } from '@/types';

const TYPE_LABEL: Record<Education['type'], string> = {
  publication: '論文',
  certification: '資格',
  degree: '学歴',
};

const TYPE_BADGE: Record<Education['type'], string> = {
  publication: 'bg-badge-lang-bg text-badge-lang-text',
  certification: 'bg-badge-db-bg text-badge-db-text',
  degree: 'bg-badge-cloud-bg text-badge-cloud-text',
};

const TYPE_DATE_PREFIX: Record<Education['type'], string> = {
  publication: '発表: ',
  certification: '取得: ',
  degree: '修了: ',
};

interface EducationAccordionProps {
  educations: Education[];
}

export function EducationAccordion({ educations }: EducationAccordionProps) {
  return (
    <ul className="flex flex-col gap-16">
      {educations.map((edu) => (
        <EducationItem key={`${edu.type}-${edu.title}`} edu={edu} />
      ))}
    </ul>
  );
}

function EducationItem({ edu }: { edu: Education }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();
  const expandable = Boolean(edu.details || (edu.images && edu.images.length > 0));

  // Render header content as a button only when expandable; otherwise as a static div
  // so non-interactive cards do not appear as disabled buttons in the tab order.
  const HeaderTag = expandable ? 'button' : 'div';
  const headerProps = expandable
    ? {
        type: 'button' as const,
        onClick: () => setIsOpen((v) => !v),
        'aria-expanded': isOpen,
        'aria-controls': contentId,
      }
    : {};

  return (
    <li>
      <div className="rounded-comfortable bg-pure-white shadow-subtle-card">
        <HeaderTag
          {...headerProps}
          className="flex w-full flex-col gap-8 p-32 text-left"
        >
          <span className={`inline-block self-start rounded-pill px-10 py-3 font-medium text-caption ${TYPE_BADGE[edu.type]}`}>
            {TYPE_LABEL[edu.type]}
          </span>
          <h3 className="text-card-title text-vercel-black">{edu.title}</h3>
          {edu.institution && <p className="text-body-small text-gray-600">{edu.institution}</p>}
          <time dateTime={edu.date} className="font-geist-mono text-caption text-gray-500">
            {TYPE_DATE_PREFIX[edu.type]}{edu.date}
          </time>
          {edu.description && <p className="text-body-small text-gray-600">{edu.description}</p>}
          {expandable && (
            <span className="font-medium text-button-link text-link-blue">
              {isOpen ? '詳細を閉じる ▲' : '詳細を見る ▼'}
            </span>
          )}
        </HeaderTag>
        {expandable && (
          <div
            id={contentId}
            className="accordion-content"
            data-state={isOpen ? 'open' : 'closed'}
          >
            <div>
              <div className="flex flex-col gap-16 px-32 pb-32">
                {edu.details && <p className="text-body-small text-gray-600">{edu.details}</p>}
                {edu.images && edu.images.length > 0 && (
                  <ul className="grid gap-16 md:grid-cols-2">
                    {edu.images.map((img) => (
                      <li key={img.src} className="flex flex-col gap-8">
                        <div className="relative aspect-[16/9] overflow-hidden rounded-image bg-gray-50">
                          <Image src={img.src} alt={img.alt} fill className="object-contain" />
                        </div>
                        {img.caption && (
                          <p className="text-caption text-gray-500">{img.caption}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}
```

**ポイント**:
- `details` か `images` がある場合のみ展開可能（`expandable` フラグ）。
- アコーディオンは `grid-template-rows` トランジションで実装、JavaScript で高さ計測しない。
- 画像は `next/image` の `fill` レイアウト + `aspect-[16/9]` コンテナで統一。
- `useId` で content の id を一意に生成（複数アコーディオン同時展開対応）。

### `src/components/about/PersonalInfoSection.tsx`

```tsx
import type { PersonalInfo } from '@/types';

interface PersonalInfoSectionProps {
  info: PersonalInfo;
}

export function PersonalInfoSection({ info }: PersonalInfoSectionProps) {
  return (
    <div className="flex flex-col gap-32">
      <div className="rounded-comfortable bg-pure-white p-32 shadow-subtle-card">
        <span className="inline-block rounded-pill bg-badge-cloud-bg px-10 py-3 font-medium text-badge-cloud-text text-caption">
          資質タイプ
        </span>
        <h3 className="mt-12 text-card-title text-vercel-black">{info.type}</h3>
        <p className="mt-12 text-body-small text-gray-600">{info.typeDescription}</p>
      </div>

      <div>
        <h3 className="text-card-title-light text-vercel-black">上位 3 つの資質</h3>
        <ul className="mt-16 grid gap-16 md:grid-cols-3">
          {info.topQualities.map((q) => (
            <li
              key={q.title}
              className="flex flex-col gap-8 rounded-comfortable bg-pure-white p-32 shadow-subtle-card"
            >
              <h4 className="text-card-title text-vercel-black">{q.title}</h4>
              <p className="text-body-small text-gray-600">{q.description}</p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-card-title-light text-vercel-black">自己認識</h3>
        <ul className="mt-16 flex flex-col gap-8">
          {info.selfAwareness.map((item) => (
            <li
              key={item}
              className="rounded-comfortable bg-pure-white p-24 shadow-subtle-card text-body-small text-gray-600"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

### `src/components/about/NextReadNav.tsx`

```tsx
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface NextReadCard {
  href: string;
  title: string;
  description: string;
}

interface NextReadNavProps {
  cards: NextReadCard[];
}

export function NextReadNav({ cards }: NextReadNavProps) {
  return (
    <ul className="grid gap-32 md:grid-cols-3">
      {cards.map((card) => (
        <li key={card.href}>
          <Link
            href={card.href}
            className="group flex h-full flex-col gap-12 rounded-comfortable bg-pure-white p-32 shadow-subtle-card transition-all duration-200 hover:-translate-y-4 hover:shadow-full-card"
          >
            <h3 className="text-card-title text-vercel-black">{card.title}</h3>
            <p className="text-body-small text-gray-600">{card.description}</p>
            <span className="mt-auto inline-flex items-center gap-4 font-medium text-button-link text-link-blue">
              詳しく見る
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
```

## ページ統合

### `src/app/about/page.tsx`

```tsx
import { EducationAccordion } from '@/components/about/EducationAccordion';
import { NextReadNav } from '@/components/about/NextReadNav';
import { PersonalInfoSection } from '@/components/about/PersonalInfoSection';
import { SkillGrid } from '@/components/about/SkillGrid';
import { StickyNav } from '@/components/about/StickyNav';
import { Timeline } from '@/components/about/Timeline';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';
import { careers } from '@/data/career';
import { educations } from '@/data/education';
import { siteMetadata } from '@/data/metadata';
import { skills } from '@/data/skills';

const NAV_ITEMS = [
  { id: 'intro', label: 'イントロ' },
  { id: 'career', label: 'キャリア' },
  { id: 'skills', label: 'スキル' },
  { id: 'education', label: '学歴' },
  { id: 'personal', label: 'パーソナル' },
];

const NEXT_READ_CARDS = [
  { href: '/projects/', title: 'サイドプロジェクト', description: '個人開発・技術書・コミュニティ活動の一覧' },
  { href: '/blog/', title: 'ブログ', description: '技術記事・執筆活動' },
  { href: '/contact/', title: 'お問い合わせ', description: 'メール・LinkedIn での連絡先' },
];

export default function AboutPage() {
  const { author } = siteMetadata;

  return (
    <>
      <section
        className="mx-auto max-w-[1200px] bg-pure-white px-16 py-40 md:px-32"
        aria-label="経歴"
      >
        <AnimateOnScroll>
          <h1 className="text-display-hero text-vercel-black">About</h1>
          <p className="mt-16 text-body-large text-gray-600">経歴とスキルセット</p>
        </AnimateOnScroll>
      </section>

      <StickyNav items={NAV_ITEMS} />

      <section id="intro" className="bg-pure-white" aria-label="自己紹介">
        <div className="mx-auto max-w-[1200px] px-16 py-40 md:px-32">
          <AnimateOnScroll>
            <h2 className="text-section-heading text-vercel-black">Introduction</h2>
            <div className="mt-16 flex flex-col gap-16">
              {author.introduction.split('\n\n').map((p) => (
                <p key={p.slice(0, 20)} className="text-body-large text-gray-600">{p}</p>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <section id="career" className="bg-gray-50" aria-label="職務経歴">
        <div className="mx-auto max-w-[1200px] px-16 py-40 md:px-32">
          <AnimateOnScroll><h2 className="text-section-heading text-vercel-black">Career</h2></AnimateOnScroll>
          <AnimateOnScroll className="mt-32"><Timeline careers={careers} /></AnimateOnScroll>
        </div>
      </section>

      <section id="skills" className="bg-pure-white" aria-label="スキル">
        <div className="mx-auto max-w-[1200px] px-16 py-40 md:px-32">
          <AnimateOnScroll><h2 className="text-section-heading text-vercel-black">Skills</h2></AnimateOnScroll>
          <AnimateOnScroll className="mt-32"><SkillGrid skills={skills} /></AnimateOnScroll>
        </div>
      </section>

      {educations.length > 0 && (
        <section id="education" className="bg-gray-50" aria-label="学歴・資格">
          <div className="mx-auto max-w-[1200px] px-16 py-40 md:px-32">
            <AnimateOnScroll><h2 className="text-section-heading text-vercel-black">Education</h2></AnimateOnScroll>
            <AnimateOnScroll className="mt-32">
              <EducationAccordion educations={educations} />
            </AnimateOnScroll>
          </div>
        </section>
      )}

      {author.personalInfo && (
        <section id="personal" className="bg-pure-white" aria-label="パーソナル情報">
          <div className="mx-auto max-w-[1200px] px-16 py-40 md:px-32">
            <AnimateOnScroll><h2 className="text-section-heading text-vercel-black">Personal</h2></AnimateOnScroll>
            <AnimateOnScroll className="mt-32">
              <PersonalInfoSection info={author.personalInfo} />
            </AnimateOnScroll>
          </div>
        </section>
      )}

      <section className="bg-gray-50" aria-label="次に読む">
        <div className="mx-auto max-w-[1200px] px-16 py-40 md:px-32">
          <AnimateOnScroll>
            <h2 className="text-section-heading text-vercel-black">Next read</h2>
            <p className="mt-16 text-body-small text-gray-600">他のセクションへ</p>
          </AnimateOnScroll>
          <AnimateOnScroll className="mt-32">
            <NextReadNav cards={NEXT_READ_CARDS} />
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
```

**ポイント**:
- 既存の Hero セクション（`<h1>About</h1>` + tagline）はそのまま、最大幅コンテナを保持。
- StickyNav は max-width を持たない全幅 (内側で max-width 制限) で背景色を独立。
- 各セクションは外側 `<section>` で背景色を保ち、内側で max-width コンテナを作る（交互背景色を全幅で適用するため）。

## テスト設計

### テストファイル一覧

| ファイル | 検証内容 |
| --- | --- |
| `__tests__/hooks/useSectionObserver.test.tsx` | sectionIds 空のとき early return / 初期値 null / 戻り値の型 |
| `__tests__/components/about/StickyNav.test.tsx` | items から nav リスト・href 生成、aria-label、aria-current の有無 (初期は無) |
| `__tests__/components/about/EducationAccordion.test.tsx` | 開閉動作、aria-expanded 切替、details/images 無いカードは展開不可、画像 alt 属性 |
| `__tests__/components/about/PersonalInfoSection.test.tsx` | type / 上位3資質 / 自己認識の各表示 |
| `__tests__/components/about/NextReadNav.test.tsx` | cards 件数、href、タイトル、説明 |
| `__tests__/app/about/page.test.tsx` | 既存テスト維持 + StickyNav 表示 / Personal セクション表示 / NextReadNav 表示 / セクション id 属性 |

### Hook テストの留意点

`vitest.setup.ts` で `IntersectionObserver` は no-op mock。`useSectionObserver` は observe しても何も発火しないため、テストでは:
- レンダー後の初期戻り値が `null` であること
- sectionIds が空のときも例外なく動作（`activeId === null`）
- React 19 の `act` 内で実行できる

### 既存 about/page.test.tsx への影響

既存テストの `getAllByRole('article').length === careers.length` は:
- Timeline 内の `<article>` 5件
- EducationAccordion は `<button>` ベースで `<article>` を持たない
→ 既存アサーションを維持できる。NextReadNav は `<a>` リンクなので article 件数に影響しない。

## 影響範囲

| ファイル | タイプ |
| --- | --- |
| `src/types/index.ts` | 修正 (Education 拡張、PersonalInfo / EducationImage / PersonalQuality 追加) |
| `src/data/education.ts` | 修正 (details / images 追加) |
| `src/data/metadata.ts` | 修正 (personalInfo 追加) |
| `src/app/globals.css` | 修正 (scroll-padding-top, accordion-content 追加) |
| `src/hooks/useSectionObserver.ts` | 新規 |
| `src/components/about/StickyNav.tsx` | 新規 |
| `src/components/about/EducationAccordion.tsx` | 新規 |
| `src/components/about/PersonalInfoSection.tsx` | 新規 |
| `src/components/about/NextReadNav.tsx` | 新規 |
| `src/app/about/page.tsx` | 修正 (セクション id, StickyNav, EducationAccordion, PersonalInfoSection, NextReadNav 統合) |
| `__tests__/hooks/useSectionObserver.test.tsx` | 新規 |
| `__tests__/components/about/StickyNav.test.tsx` | 新規 |
| `__tests__/components/about/EducationAccordion.test.tsx` | 新規 |
| `__tests__/components/about/PersonalInfoSection.test.tsx` | 新規 |
| `__tests__/components/about/NextReadNav.test.tsx` | 新規 |
| `__tests__/app/about/page.test.tsx` | 修正 |

新規 9 (component 4 + hook 1 + テスト 5) + 修正 6 = 計 15 ファイル。

## リスク・考慮事項

| リスク | 対応策 |
| --- | --- |
| StickyNav が Header と重なる | `top-[56px]` で Header 直下に配置、`scroll-padding-top` で同値オフセット |
| アコーディオンが SSR 時に閉じた状態でレンダー | `useState(false)` 初期値で SSR でも閉じた状態。クライアント hydration 後に開閉可能 |
| IntersectionObserver の jsdom 互換 | 既存 `vitest.setup.ts` の MockIntersectionObserver でテスト動作確認済み |
| 学術写真サイズが大きい | `next.config.ts` で `unoptimizedImages: true` (Static Export) のため最適化なし。`aspect-[16/9]` コンテナ＋`object-contain` で表示崩れ回避。実画像 `2318x2048`（約 2MB）は許容範囲外なら別 PR で圧縮検討 |
| パーソナル情報の公開度合い | requirements F4 でプライバシー配慮を明記。給与志向・ワークバランス指標は除外、PR レベルの強み・志向のみ |
| アコーディオン CSS が `prefers-reduced-motion` で正常動作 | `@media (prefers-reduced-motion: reduce)` で transition 無効化 (既存 `animate-fade-in-up` と同じパターン) |

## 計画書との差分

- **計画書 D 章**: `<section id="intro" bg-pure-white>` のように `<section>` に直接背景クラスを付けるとあるが、`max-w-[1200px]` コンテナと矛盾するため、外側 `<section bg-*>` + 内側 `<div max-w-[1200px]>` の二段構造に変更（全幅背景色を実現）。
- **`useSectionObserver` インターフェース**: 計画書では「アクティブセクション ID を返す」とのみ記載。具体仕様として `sectionIds` 必須引数 + `rootMargin` オプション + 戻り値 `string | null` に確定。
- **NextReadNav カード数**: 計画書「2-3 枚」に対し 3 枚（Projects / Blog / Contact）固定。サイト構成上この 3 つが妥当（`/projects/`, `/blog/`, `/contact/` の既存ルートを確認済み）。
- **`scroll-behavior: smooth` を CSS で実装**: 計画書では言及なし。アンカーリンクの UX 向上のため追加。`prefers-reduced-motion` 対応も同時実施。
- **`PersonalInfo` 型の再設計**: 計画書セクション A の `PersonalInfo` は `{ aptitudeResults?: { strengths, weaknesses, selfDescription }, highlights? }` という汎用構造だったが、適性試験の実出力形式（資質タイプ × 説明 × 上位3資質 × 自己認識）に合わせて `{ type, typeDescription, topQualities, selfAwareness }` に変更。型の抽象度より実データとの整合性を優先した。
- **`personalInfo` の `SiteMetadata.author` への配置**: 既存の `author.introduction` / `author.strengths` と同様に「作者プロフィール情報」として `metadata.ts` に集約するパターンを踏襲。独立ファイル化（`src/data/personalInfo.ts`）は将来のリファクタリング候補。
- **StickyNav 初期アクティブ状態**: 計画書では明示なし。設計では `useSectionObserver` の `rootMargin` で「画面上 20%〜40% に入ったセクションをアクティブ」とするが、ページ最上部ではどのセクションも該当しないため、`StickyNav` 側で `useMemo` した sectionIds を渡しつつ、`activeId ?? items[0].id` のフォールバックで最初のセクションを既定アクティブとする。
- **アコーディオンの非展開カードの実装**: 計画書では「展開可否」の言及なし。設計では `details` / `images` のいずれも持たないカードは `<button disabled>` ではなく純粋な `<div>` でレンダーし、フォーカス可能な要素を含まないようにする（WCAG 2.1: 無効なインタラクティブ要素はそもそも提示しない）。
- **アコーディオン開閉の独立性**: 複数カードの同時展開を許容する独立 `useState` 設計。「1つ開くと他が閉じる」挙動は採用しない（学歴/論文を見比べるユースケースを想定）。
