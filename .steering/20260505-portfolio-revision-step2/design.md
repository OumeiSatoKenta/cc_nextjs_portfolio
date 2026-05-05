# Step 2: トップページ Hub 化 — 設計

## 設計方針

1. **既存パターン踏襲**: レイアウト・カラー・カード形状は既存 `page.tsx` / `BlogCard` / `ProjectCard` と同じトークン・クラスを使う。
2. **データ駆動**: 全コンポーネントは props で**ソース配列**を受け取り、ビュー固有のフィルタ/スライス（featured=true 抽出、最新 N 件、expert/advanced 抽出など）はコンポーネント内部で行う。コンポーネント自身が `siteMetadata` / `skills` / `projects` / `blogPosts` を import しないことでテスト容易性を確保（fixture を直接渡せる）。`page.tsx` は単にデータ配列を渡すだけ。
3. **共通ラッパー導入**: `SectionPreview` でセクション見出し + 「もっと見る」リンクを一元化し、4 セクションで重複を避ける。
4. **既存コンポーネントの再利用**: `ProjectCard` (FeaturedProjects)、`BlogCard` (LatestBlog) はそのまま使う。新規コンポーネントは増やさない。

## コンポーネント設計

### `src/components/home/SectionPreview.tsx`

```tsx
import Link from 'next/link';

interface SectionPreviewProps {
  title: string;
  ariaLabel: string;
  href: string;
  linkLabel: string;
  children: React.ReactNode;
}

export function SectionPreview({ title, ariaLabel, href, linkLabel, children }: SectionPreviewProps) {
  return (
    <section
      className="mx-auto max-w-[1200px] px-16 pb-40 md:px-32"
      aria-label={ariaLabel}
    >
      <div className="flex items-end justify-between gap-16">
        <h2 className="text-section-heading text-vercel-black">{title}</h2>
        <Link
          href={href}
          className="font-medium text-button-link text-link-blue hover:underline"
        >
          {linkLabel} →
        </Link>
      </div>
      <div className="mt-32">{children}</div>
    </section>
  );
}
```

**ポイント**:
- `<h2>` 見出しを既存の `text-section-heading` で統一。
- 「もっと見る」リンクを右側に配置。`flex items-end justify-between` で見出しとベースライン揃え。
- レスポンシブ: モバイルでも横並び（gap-16 で詰めすぎない）。
- セクション上部パディングは `pb-40` のみ（`pt` 無し）。これは既存 `page.tsx` の Strengths セクション (`pb-40` のみ) と同じパターン。Hero (`py-40`) の下端パディングが次セクション上端の余白を担うため、二重パディングを避けて視覚的リズムを既存ページと揃える。

### `src/components/home/CareerSummary.tsx`

```tsx
import type { Career } from '@/types';

interface CareerSummaryProps {
  careers: Career[];
  limit?: number; // default 3
}

export function CareerSummary({ careers, limit = 3 }: CareerSummaryProps) {
  const items = careers.slice(0, limit);

  return (
    <ul className="flex flex-col gap-16">
      {items.map((career) => (
        <li
          key={`${career.company}-${career.period.start}`}
          className="flex flex-col gap-8 rounded-comfortable bg-pure-white p-24 shadow-subtle-card md:flex-row md:items-center md:justify-between"
        >
          <div className="flex flex-col gap-4">
            <h3 className="text-card-title-light text-vercel-black">{career.company}</h3>
            <p className="text-body-small text-gray-600">{career.role}</p>
          </div>
          <time className="font-geist-mono text-caption text-gray-500">
            {formatPeriod(career.period)}
          </time>
        </li>
      ))}
    </ul>
  );
}

function formatPeriod(period: Career['period']): string {
  const end = period.end ?? '現在';
  return `${period.start} – ${end}`;
}
```

**ポイント**:
- 配列スライスでキャリア最新 N 件を表示（デフォルト 3）。
- カードを軽量化 (`p-24`, `card-title-light`)。Hero との視覚的階層を保つ。
- `formatPeriod` は単純な文字列フォーマット（既存の Timeline でも同様の処理あり、引用は最小化）。
- key は `company + start` で複合キー。

### `src/components/home/SkillsPreview.tsx`

```tsx
import type { Skill } from '@/types';

interface SkillsPreviewProps {
  skills: Skill[];
}

const LEVEL_BADGE_CLASS: Record<'expert' | 'advanced', string> = {
  expert: 'bg-badge-cloud-bg text-badge-cloud-text',
  advanced: 'bg-badge-tool-bg text-badge-tool-text',
};

export function SkillsPreview({ skills }: SkillsPreviewProps) {
  const top = skills.filter(
    (s): s is Skill & { level: 'expert' | 'advanced' } =>
      s.level === 'expert' || s.level === 'advanced',
  );

  return (
    <ul className="flex flex-wrap gap-12">
      {top.map((skill) => (
        <li key={skill.name}>
          <span
            className={`rounded-pill px-10 py-3 font-medium text-caption ${LEVEL_BADGE_CLASS[skill.level]}`}
          >
            {skill.name}
          </span>
        </li>
      ))}
    </ul>
  );
}
```

**ポイント**:
- props で受け取った `skills` から expert/advanced を抽出（コンポーネントは並び替えしない、データ層の順序を尊重）。
- バッジスタイル統一: `rounded-pill px-10 py-3 text-caption`（BlogCard / ProjectCard のタグと同形）。`level` で bg/text トークンを切替（expert は cloud 系の濃色、advanced は tool 系の薄色）。
- 視覚的な強弱は色トークンで表現するため、Expert ラベルは不要。

### `src/components/home/FeaturedProjects.tsx`

```tsx
import { ProjectCard } from '@/components/projects/ProjectCard';
import type { Project } from '@/types';

interface FeaturedProjectsProps {
  projects: Project[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const featured = projects.filter((p) => p.featured);

  return (
    <div className="grid gap-32 md:grid-cols-2">
      {featured.map((project) => (
        <ProjectCard
          key={project.id}
          title={project.title}
          description={project.description}
          technologies={project.technologies}
          githubUrl={project.githubUrl}
          liveUrl={project.liveUrl}
          highlights={project.highlights}
          metrics={project.metrics}
          linkLabel={project.linkLabel}
          thumbnail={project.thumbnail}
        />
      ))}
    </div>
  );
}
```

**ポイント**:
- `ProjectCard` をそのまま使う（再利用）。
- 2 列グリッド (md以上)、モバイルは 1 列。
- props 渡しは projects/page.tsx と同じパターン。

### `src/components/home/LatestBlog.tsx`

```tsx
import { BlogCard } from '@/components/blog/BlogCard';
import type { BlogPost } from '@/types';

interface LatestBlogProps {
  posts: BlogPost[];
  limit?: number; // default 3
}

export function LatestBlog({ posts, limit = 3 }: LatestBlogProps) {
  const latest = [...posts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);

  return (
    <div className="grid gap-32 md:grid-cols-3">
      {latest.map((post) => (
        <BlogCard
          key={post.url}
          title={post.title}
          url={post.url}
          publishedAt={post.publishedAt}
          platform={post.platform}
          description={post.description}
          tags={post.tags}
        />
      ))}
    </div>
  );
}
```

**ポイント**:
- スプレッドで原配列を破壊しない。
- `publishedAt` 降順ソートで最新 3 件。
- 3 列グリッド (md以上)。

### `src/app/page.tsx` 修正

```tsx
import { CareerSummary } from '@/components/home/CareerSummary';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { HeroSection } from '@/components/home/HeroSection';
import { LatestBlog } from '@/components/home/LatestBlog';
import { SectionPreview } from '@/components/home/SectionPreview';
import { SkillsPreview } from '@/components/home/SkillsPreview';
import { StrengthCard } from '@/components/home/StrengthCard';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';
import { blogPosts } from '@/data/blog';
import { careers } from '@/data/career';
import { siteMetadata } from '@/data/metadata';
import { projects } from '@/data/projects';
import { skills } from '@/data/skills';

export default function HomePage() {
  const { author } = siteMetadata;

  return (
    <>
      <AnimateOnScroll>
        <HeroSection name={author.name} tagline={author.tagline} stats={author.stats} />
      </AnimateOnScroll>

      <AnimateOnScroll>
        <SectionPreview
          title="Career"
          ariaLabel="経歴"
          href="/about/"
          linkLabel="経歴を詳しく見る"
        >
          <CareerSummary careers={careers} />
        </SectionPreview>
      </AnimateOnScroll>

      <section className="mx-auto max-w-[1200px] px-16 pb-40 md:px-32" aria-label="強み">
        <ul className="grid gap-32 md:grid-cols-2 lg:grid-cols-3">
          {author.strengths.map((strength, index) => (
            <li key={strength.title}>
              <AnimateOnScroll delay={index * 100}>
                <StrengthCard ... />
              </AnimateOnScroll>
            </li>
          ))}
        </ul>
      </section>

      <AnimateOnScroll>
        <SectionPreview
          title="Skills"
          ariaLabel="スキルプレビュー"
          href="/about/"
          linkLabel="スキルを詳しく見る"
        >
          <SkillsPreview skills={skills} />
        </SectionPreview>
      </AnimateOnScroll>

      <AnimateOnScroll>
        <SectionPreview
          title="Featured Projects"
          ariaLabel="Featured プロジェクト"
          href="/projects/"
          linkLabel="すべてのプロジェクトを見る"
        >
          <FeaturedProjects projects={projects} />
        </SectionPreview>
      </AnimateOnScroll>

      <AnimateOnScroll>
        <SectionPreview
          title="Latest Posts"
          ariaLabel="最新ブログ"
          href="/blog/"
          linkLabel="すべての記事を見る"
        >
          <LatestBlog posts={blogPosts} />
        </SectionPreview>
      </AnimateOnScroll>
    </>
  );
}
```

**ポイント**:
- 既存の StrengthCard セクションは温存（独自レイアウト維持）。SectionPreview を使わず素のセクションにする。
- 各 SectionPreview は `AnimateOnScroll` で全体をラップ。
- ヘッダー名は英語ベース（"Career", "Skills" 等）。タグラインは「Career」だけ和洋折衷感が出る可能性があるが既存 About / Blog / Projects と整合。

## テスト設計

### テストファイル一覧

| ファイル | 検証内容 |
| --- | --- |
| `__tests__/components/home/SectionPreview.test.tsx` | h2 見出し、ariaLabel、href、linkLabel、children のレンダリング |
| `__tests__/components/home/CareerSummary.test.tsx` | キャリア件数（slice 動作）、会社名・役割・期間（end あり/なし） |
| `__tests__/components/home/SkillsPreview.test.tsx` | expert/advanced のみフィルタ、Expert バッジ表示、intermediate を含まない |
| `__tests__/components/home/FeaturedProjects.test.tsx` | featured=true のみ表示、ProjectCard (h3 タイトル) のレンダリング |
| `__tests__/components/home/LatestBlog.test.tsx` | 最新 N 件、降順ソート、limit prop |
| `__tests__/app/page.test.tsx` | 既存テストに加え、(1) 新セクションの h2 見出し / 「もっと見る」リンク href の検証、(2) `getAllByRole('article')` を `aria-label="強み"` 配下に限定して件数アサーションを維持（StrengthCard 件数検証は強みセクションのスコープに限定） |

### 主要アサーションパターン

- 件数: `screen.getAllByRole('article').length === N` または `container.querySelectorAll('li').length`
- 順序: `screen.getAllByRole('heading', { level: 3 })` を取って配列順を比較
- データ駆動: `siteMetadata` / `skills` / `projects` / `blogPosts` を直接 import して期待値を生成

### テストデータ

- 各テストファイルは内部にミニマルな fixture を定義（既存テストと同じスタイル）。
- `page.test.tsx` のみ実データに依存（既存と同様）。

## 影響範囲

| ファイル | 変更タイプ |
| --- | --- |
| `src/components/home/SectionPreview.tsx` | 新規 |
| `src/components/home/CareerSummary.tsx` | 新規 |
| `src/components/home/SkillsPreview.tsx` | 新規 |
| `src/components/home/FeaturedProjects.tsx` | 新規 |
| `src/components/home/LatestBlog.tsx` | 新規 |
| `src/app/page.tsx` | 修正（新セクション統合） |
| `__tests__/components/home/SectionPreview.test.tsx` | 新規 |
| `__tests__/components/home/CareerSummary.test.tsx` | 新規 |
| `__tests__/components/home/SkillsPreview.test.tsx` | 新規 |
| `__tests__/components/home/FeaturedProjects.test.tsx` | 新規 |
| `__tests__/components/home/LatestBlog.test.tsx` | 新規 |
| `__tests__/app/page.test.tsx` | 修正（新セクション検証追加） |

新規 5 ファイル + 新規テスト 5 ファイル + 修正 2 ファイル = 12 ファイル。

## リスク・考慮事項

| リスク | 対応策 |
| --- | --- |
| トップページが縦に長くなりすぎる | 各セクションを `pb-40` で適度に詰める。AnimateOnScroll のフェードインで視認性を確保。 |
| Featured プロジェクトが 0 件 / 3+ 件になった場合の崩れ | `filter` ベースなので 0 件は何も表示されない（grid は空）、3+ 件は md:grid-cols-2 でラップ。許容範囲。 |
| Career データの会社名露出 | 現行データの `company` は実名 / 業界記述ともに既に表示用に整っているため、Step 2 では値の編集は行わない（データ層の責務）。 |
| Blog 件数が 3 件未満 | `slice(0, 3)` のため 3 件未満は全件表示。grid `md:grid-cols-3` で 1〜2 件のときは右側列が空になるが、`justify-items-start` 等のフォールバックは入れない（許容範囲）。現状 6 件あるため当面問題なし。 |
| 同一会社で複数キャリアエントリ追加時の key 衝突 | 現状は `${company}-${period.start}` で一意、再入社時は start が異なるので衝突しない。長期的には `Career` 型に `id` フィールドを追加するのが望ましいが Step 2 スコープ外。 |
| skills の expert/advanced が 0 件になった場合 | filter 結果が空。リスト自体が表示されないだけで崩れはない。許容。 |

## 計画書との差分

- **要件確認 F2**: 計画書「上位 6-8 個」に対し、現状 expert/advanced 計 10 件をフルで表示（バッジ列挙は一覧性が高いため件数制限不要と判断）。要件 F2 を「expert/advanced 全件」に修正。
- **計画書 D 章のセクション順**: 計画書では `Hero → CareerSummary → Strengths → SkillsPreview → FeaturedProjects → LatestBlog → ActivityPreview` となっており、ActivityPreview は Step 5 のため Step 2 では除外。
