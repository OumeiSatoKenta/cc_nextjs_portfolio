# ポートフォリオ改善 — フィードバック対応の段階実装計画

## Context

ポートフォリオサイト（Next.js 16 + Tailwind CSS v4）のMVP完成後、第三者から25項目のフィードバックを受けた。主な指摘は「トップページが薄い」「スキルや経歴の見せ方が弱い」「面接官が知りたい情報（チーム規模・マネジメント経験）が足りない」「ナビゲーションが不十分」の4軸。

**追加する機能**:

1. **トップページ Hub 化** — 全ページのプレビュー＋動線を配置し、コンテンツハブとして機能させる
2. **About ページ強化** — ページ内ナビ、セクション背景、学歴アコーディオン、パーソナル情報、フッター誘導
3. **詳細メタデータ充実** — プロジェクトのチーム規模・役割、キャリアの役割種別、スキルアイコン
4. **活動履歴ページ新設** — 独立した `/activity` ページでコミュニティ活動を一覧化
5. **コンテンツ・データ基盤** — イントロ書き直し、ナビ日本語化、スキル並び順、プロジェクト並び順

**ユーザーの要件確認結果**:

- メニューラベル: **日本語にする**
- 活動履歴: **独立ページ（`/activity`）として新設**
- パーソナル情報: **`docs/20260505_適正試験結果` を使用**
- 学術写真: **`collider_experiment_image.png`, `cosmic_ray_air_shower.png` を配置済み**

**段階分割**: 5ステップに分けて段階リリース（レビュー負荷分散・テスト失敗時の切り戻し範囲縮小・各ステップ完了時点で動作確認可能）

---

## 設計サマリ

### A. データモデル拡張（`src/types/index.ts`）

```ts
// Step 1: Skill に description 追加
export interface Skill {
  name: string;
  category: SkillCategory;
  level?: SkillLevel;
  years?: number;
  description?: string;  // 補助情報（例: "VPC / ECS / Lambda 等 30+ サービス"）
  icon?: string;          // Step 4: lucide-react アイコン名
}

// Step 3: Education に詳細・画像追加
export interface Education {
  type: 'certification' | 'degree' | 'publication';
  title: string;
  institution?: string;
  date: string;
  description?: string;
  details?: string;       // アコーディオン展開時の詳細テキスト
  images?: { src: string; alt: string; caption?: string }[];
}

// Step 3: パーソナル情報
export interface PersonalInfo {
  aptitudeResults?: {
    strengths: string[];
    weaknesses: string[];
    selfDescription: string[];
  };
  highlights?: string[];
}

// Step 4: Project にメタデータ追加
export interface Project {
  // ...既存フィールド
  teamSize?: number;
  role?: string;
  userCount?: string;
}

// Step 4: Career にチーム規模・役割種別追加
export interface Career {
  // ...既存フィールド
  teamSize?: number;
  roleType?: ('design' | 'implementation' | 'management' | 'operations')[];
}

// Step 5: Activity（新規）
export type ActivityCategory = 'meetup' | 'conference' | 'study-group' | 'oss' | 'publication' | 'other';
export interface Activity {
  id: string;
  title: string;
  date: string;
  category: ActivityCategory;
  description: string;
  role?: string;
  url?: string;
  tags?: string[];
}
```

### B. ナビゲーション変更（`src/data/navigation.ts`）

Step 1 で英語→日本語ラベルに変更:
- `Home` → `ホーム`
- `About` → `経歴・スキル`
- `Side Projects` → `サイドプロジェクト`
- `Blog` → `ブログ`
- `Contact` → `お問い合わせ`

Step 5 で `活動履歴`（`/activity`）を追加（Blog の前に配置）。

### C. 新規ファイル

| パス | ステップ | 役割 |
| --- | --- | --- |
| `src/components/home/CareerSummary.tsx` | 2 | トップページ経歴概要セクション |
| `src/components/home/SkillsPreview.tsx` | 2 | トップページスキルプレビュー（上位6-8個） |
| `src/components/home/FeaturedProjects.tsx` | 2 | Featured プロジェクト2件プレビュー |
| `src/components/home/LatestBlog.tsx` | 2 | 最新ブログ3件プレビュー |
| `src/components/home/SectionPreview.tsx` | 2 | プレビューセクション共通ラッパー |
| `src/components/about/StickyNav.tsx` | 3 | About ページ内スティッキーナビ（client） |
| `src/components/about/EducationAccordion.tsx` | 3 | 学歴アコーディオン（client） |
| `src/components/about/PersonalInfoSection.tsx` | 3 | 適性試験結果・強み弱み表示 |
| `src/components/about/NextReadNav.tsx` | 3 | フッター「次に読む」誘導カード |
| `src/hooks/useSectionObserver.ts` | 3 | IntersectionObserver でアクティブセクション検知 |
| `src/data/activities.ts` | 5 | 活動履歴データ |
| `src/components/activity/ActivityTimeline.tsx` | 5 | 活動履歴タイムライン |
| `src/components/activity/ActivityCard.tsx` | 5 | 個別活動カード |
| `src/app/activity/page.tsx` | 5 | 活動履歴ページ |

### D. UI 拡張

**トップページ（`src/app/page.tsx`）** Step 2 で構成変更:
```
HeroSection（CTA順序 Step 1 で変更済み）
  ↓
CareerSummary（NEW）
  ↓
StrengthCard × 3（既存）
  ↓
SkillsPreview（NEW）
  ↓
FeaturedProjects（NEW）
  ↓
LatestBlog（NEW）
  ↓
ActivityPreview（Step 5 で追加）
```

**About ページ（`src/app/about/page.tsx`）** Step 3 で構成変更:
```
StickyNav（NEW: intro / career / skills / education / personal）
  ↓
<section id="intro" bg-pure-white> イントロ </section>
  ↓
<section id="career" bg-gray-50> キャリアタイムライン </section>
  ↓
<section id="skills" bg-pure-white> スキルグリッド </section>
  ↓
<section id="education" bg-gray-50> EducationAccordion + 学術写真 </section>
  ↓
<section id="personal" bg-pure-white> PersonalInfoSection </section>
  ↓
NextReadNav（NEW）
```

### E. スタイル拡張（`src/app/globals.css`）

Step 3: アコーディオンアニメーション（CSS grid-template-rows トランジション）
Step 5: タイピングアニメーション（余力があれば Hero に適用）

---

## 段階分割（5 ステップ）

各ステップ完了時に `npm test` 全件 PASS、`npm run lint:fix && npm run build` 通過、PR レビュー後マージ。

### Step 1: `.steering/20260505-content-data-foundation/`

**コンテンツ・データ基盤** — データファイル変更中心、コンポーネント変更最小

- `src/types/index.ts`: `Skill` に `description` フィールド追加
- `src/data/navigation.ts`: ラベルを日本語に変更
- `src/data/metadata.ts`: イントロをポジティブに書き直し + 将来ビジョン追加
- `src/components/home/HeroSection.tsx`: CTAボタン順序入替（About 左 / Projects 右）
- `src/data/skills.ts`: 強み順に並び替え + `description` 追加
- `src/data/projects.ts`: アピール順に並び替え
- テスト更新: Header, Footer, HeroSection, page テストの文言修正

### Step 2: `.steering/20260505-top-page-hub/`

**トップページ Hub 化** — 新コンポーネント5個追加

- `src/components/home/SectionPreview.tsx`: 共通ラッパー（NEW）
- `src/components/home/CareerSummary.tsx`: 経歴概要（NEW）
- `src/components/home/SkillsPreview.tsx`: スキルプレビュー（NEW）
- `src/components/home/FeaturedProjects.tsx`: Featured プロジェクト（NEW）
- `src/components/home/LatestBlog.tsx`: 最新ブログ（NEW）
- `src/app/page.tsx`: 新セクション統合
- テスト: 新コンポーネント5件 + page テスト更新

### Step 3: `.steering/20260505-about-page-enhancement/`

**About ページ強化** — ページ内ナビ + 背景色 + アコーディオン + パーソナル情報

- `src/types/index.ts`: `Education` 拡張（details, images）、`PersonalInfo` 追加
- `src/data/education.ts`: 詳細テキスト + 学術写真パス追加
- `src/data/metadata.ts`: `personalInfo`（適性試験結果から抽出）追加
- `src/hooks/useSectionObserver.ts`: IntersectionObserver フック（NEW）
- `src/components/about/StickyNav.tsx`: ページ内ナビ（NEW / client）
- `src/components/about/EducationAccordion.tsx`: 学歴アコーディオン（NEW / client）
- `src/components/about/PersonalInfoSection.tsx`: パーソナル情報（NEW）
- `src/components/about/NextReadNav.tsx`: フッター誘導（NEW）
- `src/app/about/page.tsx`: セクション構成変更 + 交互背景色
- `src/app/globals.css`: アコーディオンアニメーション追加
- テスト: 新コンポーネント4件 + フック1件 + page テスト更新

### Step 4: `.steering/20260505-detail-metadata-skill-icons/`

**詳細メタデータ + スキルアイコン** — 型拡張 + データ充実 + 既存コンポーネント強化

- `src/types/index.ts`: `Project`（teamSize, role, userCount）、`Career`（teamSize, roleType）、`Skill`（icon）拡張
- `src/data/projects.ts`: 各プロジェクトにメタデータ追加
- `src/data/career.ts`: 各キャリアにチーム規模・役割追加
- `src/data/skills.ts`: 各スキルにアイコン名追加
- `src/components/about/SkillGrid.tsx`: アイコン表示 + 得意/成長中ラベル
- `src/components/projects/ProjectCard.tsx`: メタデータ表示
- `src/components/about/TimelineItem.tsx`: チーム規模・役割バッジ
- テスト: 既存テスト3件更新

### Step 5: `.steering/20260505-activity-page-visual-polish/`

**活動履歴ページ + ビジュアル仕上げ** — 新ページ + 写真統一 + ギミック

- `src/types/index.ts`: `Activity`, `ActivityCategory` 追加
- `src/data/activities.ts`: 活動履歴データ（NEW）
- `src/data/navigation.ts`: `活動履歴` リンク追加
- `src/components/activity/ActivityTimeline.tsx`: タイムライン（NEW）
- `src/components/activity/ActivityCard.tsx`: カード（NEW）
- `src/app/activity/page.tsx`: 活動履歴ページ（NEW）
- `src/app/page.tsx`: 活動プレビューセクション追加
- `src/components/projects/ProjectThumbnail.tsx`: 写真サイズ統一（aspect-ratio）
- `src/app/globals.css`: タイピングアニメーション（余力があれば）
- テスト: 新ページ + 新コンポーネント2件 + Header/Footer テスト更新

---

## 重要な制約・リスク

| リスク | 対応策 |
| --- | --- |
| **適性試験PDF の手動データ化** | `docs/20260505_適正試験結果` を読み取り、PersonalInfo 型に構造化。Step 3 着手前に内容確認 |
| **学術写真のファイルサイズ** | collider/airshower 画像が大きい場合 `next/image` の `fill` + コンテナ制約で対応。`unoptimizedImages: true` 設定済み（Static Export） |
| **StickyNav とヘッダーの重なり** | Header が `sticky top-0 z-50`。StickyNav は `sticky top-[56px] z-40` でスタック。ヘッダー高さを計測して調整 |
| **テストの文言変更** | Step 1 でナビラベル・CTA文言を変えるため、既存テスト5件以上の更新が必要。変更漏れに注意 |
| **ナビ項目数** | Step 5 で6項目になる。デスクトップ・モバイル両方で表示確認 |

---

## Critical Files

**既存（修正）**:

- `src/types/index.ts` — Step 1, 3, 4, 5 で段階的に拡張
- `src/app/page.tsx` — Step 2, 5 でセクション追加
- `src/app/about/page.tsx` — Step 3 で構成変更
- `src/data/navigation.ts` — Step 1, 5 で変更
- `src/data/skills.ts` — Step 1, 4 で変更
- `src/data/metadata.ts` — Step 1, 3 で変更
- `src/data/projects.ts` — Step 1, 4 で変更
- `src/data/career.ts` — Step 4 で変更
- `src/data/education.ts` — Step 3 で変更
- `src/components/home/HeroSection.tsx` — Step 1
- `src/components/about/SkillGrid.tsx` — Step 4
- `src/components/about/TimelineItem.tsx` — Step 4
- `src/components/projects/ProjectCard.tsx` — Step 4
- `src/app/globals.css` — Step 3, 5

**新規（14ファイル + テスト13ファイル）**:

- Step 2: home コンポーネント 5件
- Step 3: about コンポーネント 4件 + hooks 1件
- Step 5: activity コンポーネント 2件 + ページ 1件 + データ 1件

---

## Verification

### 自動

- `npm test` — 既存テスト + 新規テスト すべて PASS
- `npm run lint:fix && npm run format && npm run build` — 0 errors

### 手動（`npm run dev`）

1. **Step 1 完了時**: ナビが日本語表示、CTA順序変更、スキル並び順確認
2. **Step 2 完了時**: トップページに経歴概要・スキルプレビュー・プロジェクト・ブログが表示
3. **Step 3 完了時**: About ページでスティッキーナビ動作、学歴アコーディオン開閉、写真表示、パーソナル情報表示、フッター誘導
4. **Step 4 完了時**: プロジェクトカードにチーム規模・役割表示、スキルにアイコン表示、キャリアに役割バッジ
5. **Step 5 完了時**: `/activity` ページ表示、トップに活動プレビュー、写真サイズ統一

### ステアリングスキル運用

- 各 Step で `.steering/20260505-[step-slug]/` の requirements / design / tasklist を作成
- tasklist の各タスクで `[ ]` → `[x]` をリアルタイム更新
- 全タスク完了後に申し送りを記録
