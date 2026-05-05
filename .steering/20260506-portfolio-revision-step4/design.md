# Step 4: 詳細メタデータ + スキルアイコン — 設計

## 設計方針

1. **型は厳密に**: `RoleType` は union type で typo を排除。`icon` は文字列で柔軟に（lucide-react のアイコン名）。
2. **アイコンマップを集約**: SkillGrid 内で `iconMap: Record<string, ComponentType>` を定義し、未対応 icon は静かにフォールバック（テキストのみ表示）。ProjectThumbnail.tsx の既存パターンを踏襲。
3. **メタデータ表示は既存パターンに揃える**: ProjectCard のメタピルは BlogCard / ProjectCard の既存タグバッジと同じスタイル。TimelineItem のロールタイプバッジも既存 technologies バッジと同形。
4. **後方互換**: 全フィールド optional。データ未設定でも既存 UI が壊れない。

## 型拡張

### `src/types/index.ts`

```ts
// Project: メタデータ追加
export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  highlights?: string[];
  metrics?: { label: string; value: string }[];
  linkLabel?: string;
  thumbnail?: ProjectThumbnail;
  featured: boolean;
  teamSize?: number;        // NEW
  role?: string;            // NEW
  userCount?: string;       // NEW
}

// Career: チーム規模・役割種別追加
export type CareerRoleType = 'design' | 'implementation' | 'management' | 'operations';

export interface Career extends CareerOverview {
  description: string;
  achievements: string[];
  technologies?: string[];
  teamSize?: number;             // NEW
  roleType?: CareerRoleType[];   // NEW
}

// Skill: アイコン追加
export interface Skill {
  name: string;
  category: SkillCategory;
  level?: SkillLevel;
  years?: number;
  description?: string;
  icon?: string;  // NEW: lucide-react icon name
}
```

## データ更新方針

### `src/data/projects.ts`

各プロジェクトの内容から導けるメタデータを追加:

| プロジェクト | teamSize | role | userCount |
| --- | --- | --- | --- |
| portfolio-site | 1 | 個人開発 | — |
| portfolio-infra | 1 | 個人開発 | — |
| tiug-community | — | 運営メンバー | — |
| aws-cert-book | 70 | 執筆・進捗管理 GAS 開発 | — (※ ダウンロード数は既存 `metrics` で表示済みのため `userCount` 省略) |
| amplify-handson-book | — | 編集 | — |
| jaws-genai-study | — | 参加・登壇 | — |

### `src/data/career.ts`

既存 description / achievements から推定可能な範囲で:

| 会社 | teamSize | roleType |
| --- | --- | --- |
| 株式会社オルトプラス (現職) | — | design, implementation, operations |
| モバイルゲーム企業 A 社 | 1 (1人で担当と明記) | design, implementation, operations |
| 大手美容メディア企業 B 社 | — | design, implementation, management (新人受け入れ教育) |
| 大手 Web プラットフォーム企業 C 社 | — | implementation, operations |
| 株式会社シャノン | — | implementation, operations, management (新人入社研修カリキュラム作成) |

teamSize は資料から確証が取れない箇所は省略する。

### `src/data/skills.ts`

各スキルに lucide-react アイコン名を追加:

| Category | Skill | Icon |
| --- | --- | --- |
| cloud | AWS | Cloud |
| cloud | Google Cloud | Cloud |
| cloud | Terraform | Boxes |
| cloud | Terragrunt | Boxes |
| language | Shell Script | Terminal |
| language | Python | Code |
| language | SQL | Database |
| language | Perl | Code |
| language | Ruby | Gem |
| database | Aurora MySQL | Database |
| database | PostgreSQL | Database |
| database | Redis / Valkey | Zap |
| database | TiDB | Database |
| database | SQL Server | Database |
| tool | Docker | Container |
| tool | Git / GitHub | GitBranch |
| tool | Jenkins | Workflow |
| tool | Claude Code (AI) | Sparkles |
| tool | Nginx | Server |
| tool | Linux (CentOS/Ubuntu) | Monitor |

## コンポーネント設計

### `src/components/projects/ProjectCard.tsx`

```tsx
// 追加 import
import { TrendingUp, User, Users } from 'lucide-react';

// props 拡張
interface ProjectCardProps {
  // ...既存
  teamSize?: number;
  role?: string;
  userCount?: string;
}

// 既存の highlights / metrics の間にメタピルセクションを挿入
{(teamSize !== undefined || role || userCount) && (
  <ul className="flex flex-wrap gap-8" aria-label="プロジェクト詳細">
    {teamSize !== undefined && (
      <li className="inline-flex items-center gap-4 rounded-pill bg-badge-tool-bg px-10 py-3 font-medium text-badge-tool-text text-caption">
        <Users size={14} aria-hidden="true" />
        <span>チーム {teamSize}人</span>
      </li>
    )}
    {role && (
      <li className="inline-flex items-center gap-4 rounded-pill bg-badge-tool-bg px-10 py-3 font-medium text-badge-tool-text text-caption">
        <User size={14} aria-hidden="true" />
        <span>役割: {role}</span>
      </li>
    )}
    {userCount && (
      <li className="inline-flex items-center gap-4 rounded-pill bg-badge-tool-bg px-10 py-3 font-medium text-badge-tool-text text-caption">
        <TrendingUp size={14} aria-hidden="true" />
        <span>{userCount}</span>
      </li>
    )}
  </ul>
)}
```

**ポイント**:
- `aria-label="プロジェクト詳細"` で listitem が読み上げられる際の文脈を提供
- 各ピルは `<li>` でリスト構造、`<ul>` でラップ
- アイコンは `aria-hidden="true"` で装飾扱い、テキストで意味を伝える

### `src/components/about/Timeline.tsx`

`Career` の新フィールドを `TimelineItem` に pass-through する変更のみ:

```tsx
{careers.map((career, index) => (
  <TimelineItem
    key={`${career.company}-${career.period.start}`}
    company={career.company}
    role={career.role}
    period={career.period}
    description={career.description}
    achievements={career.achievements}
    technologies={career.technologies}
    teamSize={career.teamSize}      // NEW
    roleType={career.roleType}      // NEW
    isLast={index === careers.length - 1}
  />
))}
```

### `src/components/about/TimelineItem.tsx`

```tsx
// 追加 import
import { Users } from 'lucide-react';
import type { CareerRoleType } from '@/types';

const ROLE_TYPE_LABEL: Record<CareerRoleType, string> = {
  design: '設計',
  implementation: '実装',
  management: 'マネジメント',
  operations: '運用',
};

const ROLE_TYPE_BADGE_CLASS: Record<CareerRoleType, string> = {
  design: 'bg-badge-cloud-bg text-badge-cloud-text',
  implementation: 'bg-badge-lang-bg text-badge-lang-text',
  management: 'bg-badge-db-bg text-badge-db-text',
  operations: 'bg-badge-tool-bg text-badge-tool-text',
};

interface TimelineItemProps {
  // ...既存
  teamSize?: number;
  roleType?: CareerRoleType[];
}

// 既存の time の後、role の前にチーム規模 + 役割種別バッジを表示
{(teamSize !== undefined || (roleType && roleType.length > 0)) && (
  <div className="flex flex-wrap items-center gap-8">
    {teamSize !== undefined && (
      <span className="inline-flex items-center gap-4 rounded-pill bg-badge-tool-bg px-10 py-3 font-medium text-badge-tool-text text-caption">
        <Users size={14} aria-hidden="true" />
        チーム {teamSize}人
      </span>
    )}
    {roleType?.map((type) => (
      <span
        key={type}
        className={`rounded-pill px-10 py-3 font-medium text-caption ${ROLE_TYPE_BADGE_CLASS[type]}`}
      >
        {ROLE_TYPE_LABEL[type]}
      </span>
    ))}
  </div>
)}
```

### `src/components/about/SkillGrid.tsx`

完全リファクタ。トップレベル 2 グループ × カテゴリ × スキルチップ:

```tsx
import {
  Boxes,
  Cloud,
  Code,
  Container,
  Database,
  Gem,
  GitBranch,
  Monitor,
  Server,
  Sparkles,
  Terminal,
  Workflow,
  Zap,
} from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';
import type { Skill, SkillCategory, SkillLevel } from '@/types';

const ICON_MAP: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  Boxes, Cloud, Code, Container, Database, Gem, GitBranch,
  Monitor, Server, Sparkles, Terminal, Workflow, Zap,
};

const CATEGORY_ORDER: SkillCategory[] = ['cloud', 'language', 'database', 'tool'];
const CATEGORY_LABEL: Record<SkillCategory, string> = {
  cloud: 'Cloud / IaC',
  language: 'Languages',
  database: 'Database',
  tool: 'DevOps / Tools',
};
const CATEGORY_BADGE_CLASS: Record<SkillCategory, string> = {
  cloud: 'bg-badge-cloud-bg text-badge-cloud-text',
  language: 'bg-badge-lang-bg text-badge-lang-text',
  database: 'bg-badge-db-bg text-badge-db-text',
  tool: 'bg-badge-tool-bg text-badge-tool-text',
};

const STRONG_LEVELS: SkillLevel[] = ['expert', 'advanced'];

function isStrongSkill(skill: Skill): boolean {
  return skill.level !== undefined && STRONG_LEVELS.includes(skill.level);
}

interface SkillGridProps {
  skills: Skill[];
}

export function SkillGrid({ skills }: SkillGridProps) {
  const strong = skills.filter(isStrongSkill);
  const growing = skills.filter((s) => !isStrongSkill(s));

  return (
    <div className="flex flex-col gap-32">
      <SkillGroup label="得意領域" skills={strong} />
      <SkillGroup label="成長中" skills={growing} />
    </div>
  );
}

interface SkillGroupProps {
  label: string;
  skills: Skill[];
}

function SkillGroup({ label, skills }: SkillGroupProps) {
  if (skills.length === 0) return null;

  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABEL[category],
    items: skills.filter((s) => s.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <div>
      <h3 className="text-sub-heading-large text-vercel-black">{label}</h3>
      <div className="mt-16 grid gap-32 md:grid-cols-2">
        {grouped.map((group) => (
          <div key={group.category}>
            <h4 className="text-card-title-light text-vercel-black">{group.label}</h4>
            <ul className="mt-12 flex flex-col gap-8">
              {group.items.map((skill) => (
                <SkillChip key={skill.name} skill={skill} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

interface SkillChipProps {
  skill: Skill;
}

function SkillChip({ skill }: SkillChipProps) {
  const Icon = skill.icon ? ICON_MAP[skill.icon] : undefined;
  const badgeClass =
    skill.level === 'expert'
      ? 'bg-vercel-black text-pure-white'
      : CATEGORY_BADGE_CLASS[skill.category];
  // Compose label as a single string so getByText('AWS · 3年') keeps working.
  const label = skill.years ? `${skill.name} · ${skill.years}年` : skill.name;

  return (
    <li className="flex flex-col gap-4">
      <span
        className={`inline-flex items-center gap-6 self-start rounded-pill px-10 py-3 font-medium text-caption ${badgeClass}`}
      >
        {Icon && <Icon width={14} height={14} aria-hidden="true" />}
        <span>{label}</span>
      </span>
      {skill.description && <p className="pl-4 text-caption text-gray-500">{skill.description}</p>}
    </li>
  );
}
```

**ポイント**:
- 既存の `<h3>カテゴリ名</h3>` の上に `<h3>得意領域 / 成長中</h3>` を追加 → カテゴリヘッダは `<h4>` に降格
- レイアウト: 得意領域グループ全体 + 成長中グループ全体を縦並び。各グループ内で 2 列カテゴリグリッド
- スキルチップは縦並び（`<ul flex-col>`）に変更（横並びだとアイコン + 名前 + 年数が長くて折り返しが発生するため）
- expert は黒背景白文字（既存挙動維持）、advanced 以下はカテゴリカラー
- icon 未設定 / unknown は静かにスキップ（テキストのみ表示）

## テスト設計

### 既存テストへの影響

#### `__tests__/components/about/SkillGrid.test.tsx`

階層が `<h3>カテゴリ</h3>` から `<h3>得意領域/成長中</h3>` → `<h4>カテゴリ</h4>` に変わるためアサーション更新が必要:

- 既存: `getByRole('heading', { level: 3, name: 'Cloud / IaC' })` → `getByRole('heading', { level: 4, name: 'Cloud / IaC' })`
- 新規: `getByRole('heading', { level: 3, name: '得意領域' })` / `'成長中'`

その他、バッジクラスのアサーションは原則維持。新規テスト:
- `Boxes` アイコンが Terraform チップ内にレンダーされる
- `description` が設定されたスキルの補助テキストが表示される
- icon 未設定スキルにアイコンが表示されない
- 全スキル intermediate のときに「得意領域」グループが非表示

#### `__tests__/components/projects/ProjectCard.test.tsx`

新規テスト:
- `teamSize` 表示: "チーム 70人" のようなテキスト
- `role` 表示: "役割: 編集"
- `userCount` 表示: "16,500 ダウンロード"
- 全フィールド未設定時にメタピルセクションが非表示
- 部分的に未設定 (例: role のみ) のとき role だけ表示

#### `__tests__/components/about/TimelineItem.test.tsx`

新規テスト:
- `teamSize` バッジ表示: "チーム 1人"
- `roleType` バッジ複数表示: 設計 / 実装 / 運用 等のラベル
- 単一の roleType でも正常表示
- 両方未設定時にバッジセクションが非表示

## 影響範囲

| ファイル | タイプ |
| --- | --- |
| `src/types/index.ts` | 修正 (Project, Career, Skill 拡張、CareerRoleType 追加) |
| `src/data/projects.ts` | 修正 (6 プロジェクトにメタデータ) |
| `src/data/career.ts` | 修正 (5 エントリに teamSize / roleType) |
| `src/data/skills.ts` | 修正 (19 スキルに icon) |
| `src/components/projects/ProjectCard.tsx` | 修正 (メタピル追加) |
| `src/components/about/TimelineItem.tsx` | 修正 (チーム規模 + 役割バッジ) |
| `src/components/about/SkillGrid.tsx` | 修正 (得意/成長中グループ + アイコン) |
| `src/components/about/Timeline.tsx` | 修正 (新 props を TimelineItem に渡す) |
| `__tests__/components/projects/ProjectCard.test.tsx` | 修正 |
| `__tests__/components/about/TimelineItem.test.tsx` | 修正 |
| `__tests__/components/about/SkillGrid.test.tsx` | 修正 |

新規 0 + 修正 11 = 計 11 ファイル。

## リスク・考慮事項

| リスク | 対応策 |
| --- | --- |
| アイコン名の typo / 未対応アイコン | `iconMap[name]` が undefined の場合は静かにスキップ（既存 ProjectThumbnail と同じパターン）。アプリは壊れない |
| 既存テストの `<h3>` アサーションが壊れる | tasklist で明示的にテスト更新タスクを置く。新規テストもまとめて追加 |
| データ確証が取れない teamSize | `undefined` のままにして表示しない。「ハルシネーション禁止」の CLAUDE.md ルールに従う |
| role バッジが既存 technologies バッジと混同する | 「役割: 」プレフィックス + Users アイコンで区別。色トークンも tool 系（グレー）で 控えめに |
| メタピルが多すぎてカード縦長化 | 一行 flex-wrap で配置。長い行は折り返し許容 |
| description 表示でカード高さ不揃い | スキルチップは縦並び (li flex-col) なので、各 li の高さが内容次第で変わる。grid 内では問題なし |

## 計画書との差分

- **SkillGrid 構造**: 計画書では「アイコン表示 + 得意/成長中ラベル付きグループ分け」のみ言及。設計では「2 グループ → カテゴリ → チップ」の 3 階層構造に確定。`<h3>` を「得意領域/成長中」に、カテゴリヘッダを `<h4>` に降格。
- **CareerRoleType の export**: 計画書では未明記。型ガードのため named export として `src/types/index.ts` から公開。
- **メタピルの `<ul>` ラッピング**: 計画書では `<div>` での flex-wrap を想定。設計では `<ul aria-label>` でセマンティック化（リスト読み上げに対応）。
- **icon フィールドの値**: 計画書では Cloud / Terminal / Database / Code 等の具体例を列挙。設計では 13 種類のアイコンに確定（lucide-react の安定アイコン名のみ使用）。実装前に `node_modules/lucide-react/dist/esm/icons/` で実在を確認済み（Boxes / Cloud / Code / Container / Database / Gem / GitBranch / Monitor / Server / Sparkles / Terminal / Workflow / Zap）。
- **aws-cert-book の `userCount` 省略**: 同プロジェクトは既存 `metrics` で「ダウンロード数: 16,500」を大きな数字として表示済み。`userCount` メタピルでも同情報を表示すると重複するため、`teamSize: 70` のみ追加し `userCount` は設定しない。
- **`level: undefined` の分類**: 「得意領域 = expert / advanced」「成長中 = それ以外（intermediate, beginner, undefined を含む）」のフィルタロジックを採用。`level` 未設定スキルが「成長中」に入るのは設計意図（新規追加時のデフォルト動作を予測可能にする）。
