# Step 5: 活動履歴ページ + ビジュアル仕上げ — 設計

## アーキテクチャ概観

```
src/
├── types/index.ts                          # Activity / ActivityCategory 型を追加
├── data/
│   ├── activities.ts                       # 新規: 活動履歴データ
│   └── navigation.ts                       # NAV_LINKS に「活動履歴」を追加
├── app/activity/page.tsx                   # 新規: /activity ルート
├── components/
│   ├── activity/
│   │   ├── ActivityCard.tsx                # 新規: 活動カード
│   │   └── ActivityTimeline.tsx            # 新規: 年別タイムライン
│   ├── home/ActivityPreview.tsx            # 新規: ホーム用 軽量プレビュー
│   └── projects/ProjectThumbnail.tsx       # h-180 → aspect-[16/9] に変更
└── app/page.tsx                            # ActivityPreview をハブに統合
```

## 型定義

### `src/types/index.ts` 追加分

```ts
export type ActivityCategory =
  | 'meetup'        // ミートアップ・コミュニティ運営
  | 'conference'    // カンファレンス登壇・参加
  | 'study-group'   // 勉強会
  | 'oss'           // OSS 貢献
  | 'publication'   // 書籍・記事執筆
  | 'other';

export interface Activity {
  id: string;
  title: string;
  /** ISO 8601: YYYY-MM-DD or YYYY-MM */
  date: string;
  category: ActivityCategory;
  description: string;
  role?: string;
  url?: string;
  tags?: string[];
}
```

**設計判断**:

- `date` は文字列で保持。`new Date()` で再パースするより `slice(0, 4)` で年抽出するほうが Static Export と相性が良く、TZ ズレも回避できる。
- `id` は activity スラグ (`tiug-2024-launch` 等)。重複防止用にテストでアサート。
- `role` と `url` はオプション。データなしの活動 (継続参加など) でも `description` に主体性が残せる。

## データ

### `src/data/activities.ts`

既存資料 (`careers`, `projects`, `blogPosts`) で確証ある活動のみを収録。**新規データを発明しない**。

```ts
import type { Activity } from '@/types';

export const activities: Activity[] = [
  {
    id: 'tiug-organizer-2024',
    title: 'TiDB User Group (TiUG) 運営参加',
    date: '2024-03',
    category: 'meetup',
    description:
      '2024 年 3 月から運営メンバーとして参加。3 ヶ月ごとの MeetUp Event 企画・運営を担当し、TiDB 日本コミュニティの活性化に貢献。',
    role: '運営メンバー',
    url: 'https://tiug.connpass.com/',
    tags: ['TiDB', 'コミュニティ運営'],
  },
  {
    id: 'aws-cert-book-2024',
    title: 'AWS認定資格 ソリューションアーキテクトアソシエイトの教科書 共著',
    date: '2024-08',
    category: 'publication',
    description: '70 名の共著者で執筆した AWS SAA 対策本。3 ページの執筆・レビューに加え、進捗管理 GAS ツールを作成。',
    role: '執筆・進捗管理 GAS 開発',
    url: 'https://www.amazon.co.jp/dp/B0DK3KFYWQ',
    tags: ['AWS', 'SAA', '技術書'],
  },
  {
    id: 'amplify-handson-book-2024',
    title: 'AWS Amplify ハンズオン本 編集',
    date: '2024-09',
    category: 'publication',
    description: 'AWS ハンズオン虎の巻シリーズ「Amplify でフルスタックな開発体験をしよう」の編集を担当。',
    role: '編集',
    url: 'https://www.amazon.co.jp/dp/B0DTJMCR42',
    tags: ['AWS Amplify', '技術書'],
  },
  {
    id: 'jaws-genai-ongoing',
    title: 'JAWS / 生成AI 勉強会 継続参加',
    date: '2024',
    category: 'study-group',
    description:
      'AWS JAWS コミュニティや生成 AI 勉強会に継続参加。最新技術のキャッチアップとエンジニア同士のナレッジシェアを実践。',
    role: '参加・登壇',
    tags: ['AWS', 'JAWS', '生成AI'],
  },
];
```

**データ確証性の根拠**:

- `aws-cert-book-2024` の `date: '2024-08'` は `src/data/blog.ts` 行 43 `publishedAt: '2024-08-01'` から。`url` の ASIN は `src/data/projects.ts` 行 76 と整合。
- `amplify-handson-book-2024` の `date: '2024-09'` は `src/data/blog.ts` 行 52 `publishedAt: '2024-09-01'` から。`url` の ASIN は `src/data/projects.ts` 行 102 と整合。
- `jaws-genai-ongoing` の `date: '2024'` は年のみで保持し、開始月を発明しない (CLAUDE.md ルール)。`slice(0, 4)` グループ化は文字列 `'2024'` でも動作する。

**ソート方針**: 表示時に `b.date.localeCompare(a.date)` で降順。年のみ (`'2024'`) は年月 (`'2024-01'`) より文字列として小さいため、降順ソートでは同年内の末尾に並ぶ — 「2024 年通年継続」の活動が同年の月単位イベントの後に表示され、意味的にも妥当。

## コンポーネント設計

### F2. `src/data/navigation.ts`

```ts
export const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'ホーム' },
  { href: '/about', label: '経歴・スキル' },
  { href: '/projects', label: 'サイドプロジェクト' },
  { href: '/activity', label: '活動履歴' },   // ← 新規
  { href: '/blog', label: 'ブログ' },
  { href: '/contact', label: 'お問い合わせ' },
];
```

Header / Footer は data-driven のため自動反映。テストは `NAV_LINKS.length` ベースで書き換える。

### F3. `src/components/activity/ActivityCard.tsx`

- Server Component。
- カテゴリ別バッジカラーは `categoryClassMap` 定数で管理（switch/if を避ける）。
- カード構造: `<article>` + h3 タイトル + `<time dateTime>` + 説明 + 任意リンク + tags。
- レイアウト: `rounded-comfortable bg-pure-white p-32 shadow-subtle-card`。
- カテゴリラベル日本語表示は `categoryLabelMap` 定数で管理。

```tsx
const categoryClassMap: Record<ActivityCategory, string> = {
  meetup: 'bg-badge-cloud-bg text-badge-cloud-text',
  conference: 'bg-badge-db-bg text-badge-db-text',
  'study-group': 'bg-badge-lang-bg text-badge-lang-text',
  publication: 'bg-vercel-black text-pure-white',
  oss: 'bg-badge-tool-bg text-badge-tool-text',
  other: 'bg-badge-tool-bg text-badge-tool-text',
};

const categoryLabelMap: Record<ActivityCategory, string> = {
  meetup: 'ミートアップ',
  conference: 'カンファレンス',
  'study-group': '勉強会',
  publication: '出版',
  oss: 'OSS',
  other: 'その他',
};
```

**日付表示**: `YYYY-MM` を `YYYY 年 M 月` に整形。`date.length === 7` のケースを優先。

### F3. `src/components/activity/ActivityTimeline.tsx`

- Server Component。
- 年別グループ化: `Map<string, Activity[]>` で `date.slice(0, 4)` をキーに。
- 年は降順 (`Array.from(map.keys()).sort().reverse()`)。
- 各年は `<section aria-label={\`${year} 年の活動\`}>` でラップし、年見出し h2 + ActivityCard リスト。

```tsx
const grouped = new Map<string, Activity[]>();
const sorted = [...activities].sort((a, b) => b.date.localeCompare(a.date));
for (const a of sorted) {
  const year = a.date.slice(0, 4);
  if (!grouped.has(year)) grouped.set(year, []);
  grouped.get(year)?.push(a);
}
```

### F3. `src/app/activity/page.tsx`

```tsx
import type { Metadata } from 'next';
import { ActivityTimeline } from '@/components/activity/ActivityTimeline';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';
import { activities } from '@/data/activities';

export const metadata: Metadata = {
  title: '活動履歴',
  description: 'コミュニティ運営・登壇・執筆など継続的な活動の履歴',
};

export default function ActivityPage() {
  return (
    <>
      <section className="mx-auto max-w-[1200px] px-16 py-40 md:px-32" aria-label="活動履歴">
        <AnimateOnScroll>
          <h1 className="text-display-hero text-vercel-black">活動履歴</h1>
          <p className="mt-16 text-body-large text-gray-600">
            コミュニティ運営・登壇・執筆など、継続している社外活動の履歴です。
          </p>
        </AnimateOnScroll>
      </section>

      <ActivityTimeline activities={activities} />
    </>
  );
}
```

### F4. `src/components/home/ActivityPreview.tsx`

- 最新 3 件を行リスト表現 (Hub 全体の縦長化を抑制)。
- 各行: 年 + タイトル + カテゴリバッジ + 任意の役割。
- `<ul>` + `<li>` 構造、リンクは ActivityCard と同じ url 用。

```tsx
const latest = [...activities]
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, limit);
```

`page.tsx` での統合:

```tsx
<AnimateOnScroll>
  <SectionPreview
    title="Activity"
    ariaLabel="活動プレビュー"
    href="/activity/"
    linkLabel="すべての活動を見る"
  >
    <ActivityPreview activities={activities} />
  </SectionPreview>
</AnimateOnScroll>
```

LatestBlog の **後** に配置。

### F5. `src/components/projects/ProjectThumbnail.tsx`

固定高 `h-180` (180px) を `aspect-[16/9]` + `h-auto` に変更。すべてのケースで同じ比率。

```tsx
// before
<div className={`relative h-180 overflow-hidden rounded-image ${backgroundClass}`}>
// after
<div className={`relative aspect-[16/9] overflow-hidden rounded-image ${backgroundClass}`}>

// before (icon variant)
<div className={`grid h-180 place-items-center rounded-image ...`}>
// after
<div className={`grid aspect-[16/9] place-items-center rounded-image ...`}>
```

`fill` プロパティの `<Image>` は親要素の高さに追従するため、aspect-ratio 親で機能する。

## 非機能設計

### NF1. 既存パターン準拠

- レイアウト: `mx-auto max-w-[1200px] px-16 md:px-32 py-40` (BlogPage と同一)。
- カード: `rounded-comfortable bg-pure-white p-32 shadow-subtle-card` (BlogCard と同等)。
- バッジ: `inline-flex rounded-pill px-10 py-3 text-caption font-medium` (SkillChip と同等)。
- 見出し階層: page h1 → 年 h2 → ActivityCard h3。
- アニメーション: `<AnimateOnScroll>` を `ActivityTimeline` 内で各「年セクション」単位にラップ。`activity/page.tsx` ではヘッダー (h1 + 説明) のみラップし、`<ActivityTimeline>` 自体は内部でラップ済みのため二重に巻かない。

### NF2. アクセシビリティ

- カテゴリバッジは色 + 日本語ラベル両方で意味伝達。色弱対応。
- 外部リンクは `target="_blank" rel="noopener noreferrer"` + `aria-label="新しいタブで開く"` を追加せず、リンクテキスト自体が文脈を含む文言にする。
- `<time dateTime={date}>`: スクリーンリーダーが正しく日付として読み上げる。
- 各年セクションに `<section aria-label="2024 年の活動">`。

### NF3. Static Export 互換

- すべて Server Component。`'use client'` は不要 (アニメーションは既存の `AnimateOnScroll` で抽象化済み)。
- ビルド時に `activities` 配列が固定されるため `output: 'export'` で問題なくビルドできる。

### NF4. テスト

| 種別 | ファイル | 検証内容 |
|---|---|---|
| 新規 | `__tests__/components/activity/ActivityCard.test.tsx` | カテゴリバッジクラス、日付フォーマット、外部リンク属性 |
| 新規 | `__tests__/components/activity/ActivityTimeline.test.tsx` | 年別グループ化、降順、各年セクションの aria-label |
| 新規 | `__tests__/components/home/ActivityPreview.test.tsx` | 最新 3 件、降順 |
| 新規 | `__tests__/app/activity-page.test.tsx` | h1 / メタデータ |
| 更新 | `__tests__/components/layout/Header.test.tsx` | NAV_LINKS.length に追従 (現状 5 → 6) |
| 更新 | `__tests__/components/layout/Footer.test.tsx` | 同上 |
| 更新 | `__tests__/app/home-page.test.tsx` | Activity セクション追加検証 (存在する場合) |
| 更新 | `__tests__/components/projects/ProjectThumbnail.test.tsx` | `aspect-[16/9]` クラス検証 (存在する場合) |

`__tests__/` 配下の既存テスト命名規則を確認してから合わせる。

## スコープ外（再掲）

- F6 Hero タイピングアニメーション: 計画書「余力があれば」記載 + アクセシビリティ懸念 + ハブ完成度優先で **見送り**。
- 個別プロジェクトページ。
- 動的データ取得 (Connpass API 等)。

## 完了条件

- 型 + データ + 4 コンポーネント + 1 ページ + 1 hub プレビュー実装完了
- 既存テスト 2-4 件更新 + 新規テスト 4 件追加
- `npm run lint && npm run format && npm run type-check && npm run build && npx vitest run` 全 PASS
- 6 ページ構成のサイトとして手動確認 (ナビ・タイムライン・カード・プレビュー)
