# 設計: Projects ページ（プロジェクト一覧カード）

## 型定義

`src/types/index.ts` に追加:

```typescript
export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  highlights?: string[];
  featured: boolean;
}
```

functional-design.md の Project エンティティ定義に準拠。`longDescription` は MVP では不要（詳細ページなし）のため省略。

## データ設計

`src/data/projects.ts` — 2〜3 件のプロジェクト:

1. **Portfolio Site (Next.js)** — 本サイト。Next.js + Tailwind + Static Export。featured: true
2. **Portfolio Infrastructure (Terraform)** — AWS IaC。Terraform + CloudFront + S3。featured: true
3. 業務プロジェクトは NDA 対象のため含めない。公開リポジトリのみ掲載。

## コンポーネント設計

### ProjectCard

**パス**: `src/components/projects/ProjectCard.tsx`

**Props**: functional-design.md では `project: Project` を受け取る設計だが、F1 StrengthCard / F2 TimelineItem と同じ flat props パターンを採用する。

```typescript
interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  highlights?: string[];
}
```

**意図的逸脱**: functional-design.md では `project: Project` だが、flat props にすることでテスタビリティと再利用性を高める。F1・F2 で確立済みのパターン。

**レイアウト**:
- カード外枠: `rounded-comfortable bg-pure-white shadow-subtle-card`
- 内部パディング: `p-32`
- プロジェクト名: `text-card-title text-vercel-black`
- 概要: `text-body-small text-gray-600`
- 技術タグ: Pill Badge（`rounded-pill bg-badge-blue-bg text-badge-blue-text px-10 py-3 text-caption font-medium`）
- GitHub リンク: `text-link-blue` + 外部リンクアイコン
- ハイライト: リスト形式（`list-disc text-body-small text-gray-600`）

**ホバー**: functional-design.md に「影の強度微増」とあるが、CSS transition で shadow を変化させる。Static Export のためサーバーコンポーネントとして実装し、ホバーは Tailwind の `hover:` で対応。ただし、`shadow-subtle-card` はカスタム shadow のため Tailwind hover が直接使えない。`transition-shadow` + `hover:shadow-lg` 等の代替を検討。

→ DESIGN.md を確認すると `hover: subtle shadow intensification` とある。tailwind.config.ts に `shadow-subtle-card-hover` トークンを追加するか、または `hover:shadow-md` で代替する。シンプルさ優先で `transition-shadow hover:shadow-md` を採用。

## ページ設計

`src/app/projects/page.tsx`:

```
<section> h1 "Projects" + subtitle </section>
<section> ProjectCard grid (md:grid-cols-2) </section>
```

About ページと同じレイアウトパターン: `mx-auto max-w-[1200px] px-16 py-40 md:px-32`

## テスト方針

- `__tests__/components/projects/ProjectCard.test.tsx` — タイトル・概要・技術タグ・GitHub リンク・ハイライトの表示テスト
- `__tests__/app/projects/page.test.tsx` — ページ構造テスト（h1、プロジェクト数、データ連動）
