# ポートフォリオ改善 — `/add-feature` 実行コマンド一覧

本書は [portfolio-revision-plan.md](./portfolio-revision-plan.md) の実装を 5 つの独立した `/add-feature` コマンドに分割したものである。各ステップは単独でレビュー・マージ可能な粒度に揃え、依存関係が前→後へ一方向になるよう順序付けしている。

**重要**: 各 `/add-feature` コマンドのプロンプトには「参照ドキュメント: `docs/ideas/portfolio-revision-plan.md`」が含まれており、実装時には常に同プランを参照しながら該当ステップ範囲のみを実装する。プラン全体を一度に実装しないこと。

**前提**: MVP 完成済み（Dark Mode, サムネイル, CTA セクション等の既存実装あり）

## 実行順の全体像

```
Step 1: コンテンツ・データ基盤
   ↓   ← Step 1 完了時点で「ナビ日本語化・イントロ改善・CTA順序変更・スキル/プロジェクト並び替え完了」
Step 2: トップページ Hub 化
   ↓   ← Step 2 完了時点で「トップページが全セクションのハブとして機能」
Step 3: About ページ強化
   ↓   ← Step 3 完了時点で「About がナビ付き・アコーディオン・パーソナル情報付きの充実ページに」
Step 4: 詳細メタデータ + スキルアイコン
   ↓   ← Step 4 完了時点で「面接官が求める詳細情報（チーム規模・役割・アイコン）が全て揃う」
Step 5: 活動履歴ページ + ビジュアル仕上げ
       ← Step 5 完了時点で「全改善項目完了・6ページ構成のフルサイト」
```

**ポイント**:

- Step 1 はデータファイル中心で最もリスクが低く、即座に見た目の改善が得られる
- Step 2 でトップページの体験が大きく変わるため、ここまでで一度デプロイ・フィードバック収集可能
- 各ステップ後に `npm run lint:fix && npm run format && npm run build && npm test` が PASS することをゲートとする

---

## Step 1: コンテンツ・データ基盤

```
/add-feature ポートフォリオ改善 Step1 コンテンツ・データ基盤: ナビラベル日本語化、イントロのポジティブ書き直し＋将来ビジョン追加、CTAボタン順序入替（About左/Projects右）、スキル強み順並替え＋description追加、プロジェクトのアピール順並替え。参照ドキュメント: docs/ideas/portfolio-revision-plan.md (Step 1 範囲のみ実装)
```

**実装内容**:

- 修正: `src/types/index.ts`
  - `Skill` インターフェースに `description?: string` 追加
- 修正: `src/data/navigation.ts`
  - 5つのラベルを英語→日本語に変更（ホーム/経歴・スキル/サイドプロジェクト/ブログ/お問い合わせ）
- 修正: `src/data/metadata.ts`
  - `introduction` をSRE強みから始まるポジティブな文章に書き直し
  - 将来ビジョン段落を追加
  - **注意**: 具体的な事実は `docs/20260411_resume.pdf` を一次ソースとして参照
- 修正: `src/components/home/HeroSection.tsx`
  - CTAボタン順序入替: 「経歴・スキルを見る」（primary/dark）を左、「サイドプロジェクトを見る」（secondary/white）を右に
- 修正: `src/data/skills.ts`
  - カテゴリ内で expert → advanced → intermediate 順に並替え
  - 主要スキルに `description` フィールド追加
- 修正: `src/data/projects.ts`
  - アピール優先順に並替え
- テスト更新:
  - `__tests__/components/layout/Header.test.tsx` — 日本語ラベルに修正
  - `__tests__/components/layout/Footer.test.tsx` — 日本語ラベルに修正
  - `__tests__/components/home/HeroSection.test.tsx` — ボタンテキスト修正
  - `__tests__/app/page.test.tsx` — リンク名修正

**動作確認**:

- `npm run lint:fix && npm run format && npm run build` PASS
- `npm test` PASS（既存テスト全件 + 文言修正後）
- ブラウザ:
  1. ハンバーガーメニューが日本語表示になっている
  2. ヘッダーナビが日本語表示になっている
  3. Hero の CTA が「経歴・スキルを見る」左、「サイドプロジェクトを見る」右の順
  4. About ページのイントロがSRE強みから始まる
  5. スキルが expert → advanced → intermediate 順に表示
  6. プロジェクトがアピール順に表示

**依存**: なし（起点）

---

## Step 2: トップページ Hub 化

```
/add-feature ポートフォリオ改善 Step2 トップページHub化: HeroとStrengthCardの間に経歴概要セクション追加、強みカードの後にスキルプレビュー（上位6-8個）・Featuredプロジェクト2件・最新ブログ3件のプレビューセクションを追加。各セクションに「もっと見る」リンク付き。参照ドキュメント: docs/ideas/portfolio-revision-plan.md (Step 2 範囲のみ実装、Step 1 完了前提)
```

**実装内容**:

- 新規: `src/components/home/SectionPreview.tsx`
  - プレビューセクション共通ラッパー（title, href, linkLabel, children）
- 新規: `src/components/home/CareerSummary.tsx`
  - キャリア概要をコンパクトに表示（会社名・役割・期間）
- 新規: `src/components/home/SkillsPreview.tsx`
  - expert + advanced レベルのスキル6-8個をバッジ表示
- 新規: `src/components/home/FeaturedProjects.tsx`
  - `featured: true` プロジェクト2件をカード表示
- 新規: `src/components/home/LatestBlog.tsx`
  - 最新ブログ3件をカード表示
- 修正: `src/app/page.tsx`
  - 新セクション統合（Hero → CareerSummary → Strengths → SkillsPreview → FeaturedProjects → LatestBlog）
  - 各セクションを `AnimateOnScroll` でラップ
- 新規テスト:
  - `__tests__/components/home/SectionPreview.test.tsx`
  - `__tests__/components/home/CareerSummary.test.tsx`
  - `__tests__/components/home/SkillsPreview.test.tsx`
  - `__tests__/components/home/FeaturedProjects.test.tsx`
  - `__tests__/components/home/LatestBlog.test.tsx`
  - `__tests__/app/page.test.tsx` 更新

**動作確認**:

- `npm run lint:fix && npm run format && npm run build` PASS
- `npm test` PASS
- ブラウザ:
  1. トップページに経歴概要セクションが表示される
  2. スキルプレビューに主要スキルがバッジ表示される
  3. Featured プロジェクト2件が表示される
  4. 最新ブログ3件が表示される
  5. 各セクションの「もっと見る」リンクが正しいページに遷移する
  6. スクロールアニメーションが動作する
  7. ダークモードで正しく表示される

**依存**: Step 1（日本語ラベル、スキル並び順、プロジェクト並び順）

---

## Step 3: About ページ強化

```
/add-feature ポートフォリオ改善 Step3 Aboutページ強化: ページ内スティッキーナビ（イントロ/キャリア/スキル/学歴/パーソナル）追加、セクション毎の交互背景色、学歴をアコーディオンに変換し学術写真（collider/airshower）配置、適性試験結果からパーソナル情報セクション追加、フッターに「次に読む」誘導カード配置。参照ドキュメント: docs/ideas/portfolio-revision-plan.md (Step 3 範囲のみ実装、Step 1-2 完了前提)
```

**実装内容**:

- 修正: `src/types/index.ts`
  - `Education` に `details?: string`, `images?: { src: string; alt: string; caption?: string }[]` 追加
  - `PersonalInfo` インターフェース追加
  - `SiteMetadata.author` に `personalInfo?: PersonalInfo` 追加
- 修正: `src/data/education.ts`
  - 博士課程エントリに `details`（研究内容詳細）と `images`（collider, airshower）追加
- 修正: `src/data/metadata.ts`
  - `personalInfo` に適性試験結果を構造化して追加（`docs/20260505_適正試験結果` から抽出）
- 新規: `src/hooks/useSectionObserver.ts`
  - IntersectionObserver でアクティブセクション ID を返すフック
- 新規: `src/components/about/StickyNav.tsx`（client component）
  - セクションアンカーリンクのスティッキーバー
  - `useSectionObserver` でアクティブセクションをハイライト
  - Header（sticky top-0 z-50）の下に配置（sticky top-[56px] z-40）
- 新規: `src/components/about/EducationAccordion.tsx`（client component）
  - 折りたたみ可能な学歴カード
  - 展開時に詳細テキスト + 学術写真を表示
  - CSS grid-template-rows トランジションでアニメーション
- 新規: `src/components/about/PersonalInfoSection.tsx`
  - 適性試験の強み・弱み・自己表現をカードグリッドで表示
- 新規: `src/components/about/NextReadNav.tsx`
  - 2-3枚の誘導カード（サイドプロジェクト / ブログ / お問い合わせ）
- 修正: `src/app/about/page.tsx`
  - StickyNav 統合
  - 各セクションに `id` 属性追加
  - 交互背景色（`bg-pure-white` / `bg-gray-50`）
  - Education を EducationAccordion に置換
  - PersonalInfoSection + NextReadNav 追加
- 修正: `src/app/globals.css`
  - アコーディオンアニメーション用 CSS 追加
- 新規テスト:
  - `__tests__/hooks/useSectionObserver.test.tsx`
  - `__tests__/components/about/StickyNav.test.tsx`
  - `__tests__/components/about/EducationAccordion.test.tsx`
  - `__tests__/components/about/PersonalInfoSection.test.tsx`
  - `__tests__/components/about/NextReadNav.test.tsx`
  - `__tests__/app/about/page.test.tsx` 更新

**動作確認**:

- `npm run lint:fix && npm run format && npm run build` PASS
- `npm test` PASS
- ブラウザ:
  1. About ページ上部にスティッキーナビが表示される
  2. スクロールに応じてアクティブセクションがハイライトされる
  3. ナビのアンカーをクリックするとスムーズスクロールする
  4. セクション毎に背景色が交互に変わる
  5. 学歴セクションがアコーディオンとして動作する（開閉）
  6. 展開時に collider / airshower 写真が表示される
  7. パーソナル情報セクションに適性試験結果が表示される
  8. ページ下部に「次に読む」カードが表示される
  9. ダークモードで正しく表示される

**依存**: Step 1（イントロ書き直し）、Step 2（トップページとの動線連携）

---

## Step 4: 詳細メタデータ + スキルアイコン

```
/add-feature ポートフォリオ改善 Step4 詳細メタデータとスキルアイコン: Project型にteamSize/role/userCount追加してカードに表示、Career型にteamSize/roleType追加してタイムラインにバッジ表示、Skill型にicon追加してSkillGridにlucide-reactアイコン表示、スキルを「得意」「成長中」でラベル分け。参照ドキュメント: docs/ideas/portfolio-revision-plan.md (Step 4 範囲のみ実装、Step 1-3 完了前提)
```

**実装内容**:

- 修正: `src/types/index.ts`
  - `Project` に `teamSize?: number`, `role?: string`, `userCount?: string` 追加
  - `Career` に `teamSize?: number`, `roleType?: ('design' | 'implementation' | 'management' | 'operations')[]` 追加
  - `Skill` に `icon?: string` 追加
- 修正: `src/data/projects.ts`
  - 各プロジェクトに `teamSize`, `role`, `userCount` 追加
- 修正: `src/data/career.ts`
  - 各キャリアに `teamSize`, `roleType` 追加
- 修正: `src/data/skills.ts`
  - 各スキルに `icon` フィールド追加（Cloud, Terminal, Database, Code 等）
- 修正: `src/components/about/SkillGrid.tsx`
  - lucide-react アイコンをスキル名の左に表示
  - 「得意領域」「成長中」のラベル付きグループ分け（expert/advanced vs intermediate）
  - `description` があるスキルは補助テキスト表示
- 修正: `src/components/projects/ProjectCard.tsx`
  - チーム規模・役割・ユーザー数をメタデータピルとして表示
- 修正: `src/components/about/TimelineItem.tsx`
  - チーム規模バッジ + 役割種別カラーバッジ表示
- テスト更新:
  - `__tests__/components/about/SkillGrid.test.tsx` — アイコン・ラベル検証
  - `__tests__/components/projects/ProjectCard.test.tsx` — メタデータ表示検証
  - `__tests__/components/about/TimelineItem.test.tsx` — バッジ表示検証

**動作確認**:

- `npm run lint:fix && npm run format && npm run build` PASS
- `npm test` PASS
- ブラウザ:
  1. スキルグリッドの各スキルにアイコンが表示される
  2. スキルが「得意領域」「成長中」でグループ分けされる
  3. description 付きスキルに補助テキストが表示される
  4. プロジェクトカードにチーム規模・役割が表示される
  5. キャリアタイムラインにチーム規模と役割バッジが表示される
  6. ダークモードで正しく表示される

**依存**: Step 1（description フィールド）、Step 3（SkillGrid 構造）

---

## Step 5: 活動履歴ページ + ビジュアル仕上げ

```
/add-feature ポートフォリオ改善 Step5 活動履歴ページとビジュアル仕上げ: 新規 /activity ページ作成（年別タイムライン、カテゴリカラーバッジ付き）、ナビに「活動履歴」追加、トップページに活動プレビューセクション追加、プロジェクトサムネイルの写真サイズ統一（aspect-ratio）、余力があればHeroにタイピングアニメーション追加。参照ドキュメント: docs/ideas/portfolio-revision-plan.md (Step 5 範囲のみ実装、Step 1-4 完了前提)
```

**実装内容**:

- 修正: `src/types/index.ts`
  - `Activity`, `ActivityCategory` 型追加
- 新規: `src/data/activities.ts`
  - TiUG MeetUp、JAWS 勉強会、GenAI 勉強会、書籍出版等の活動データ
- 修正: `src/data/navigation.ts`
  - `{ href: '/activity', label: '活動履歴' }` を Blog の前に追加
- 新規: `src/components/activity/ActivityCard.tsx`
  - カテゴリ別カラーバッジ（meetup=develop-blue, conference=ship-red, study-group=preview-pink）
- 新規: `src/components/activity/ActivityTimeline.tsx`
  - 年別グループ化した縦型タイムライン
- 新規: `src/app/activity/page.tsx`
  - メタデータ + ActivityTimeline レンダリング
- 修正: `src/app/page.tsx`
  - LatestBlog の後に活動プレビューセクション追加（最新3件 + もっと見る）
- 修正: `src/components/projects/ProjectThumbnail.tsx`
  - `h-180` → `aspect-[16/9] h-auto` で写真サイズ統一
- 修正: `src/app/globals.css`
  - タイピングアニメーション CSS 追加（余力があれば Hero に適用）
- 新規テスト:
  - `__tests__/app/activity/page.test.tsx`
  - `__tests__/components/activity/ActivityTimeline.test.tsx`
  - `__tests__/components/activity/ActivityCard.test.tsx`
  - `__tests__/components/layout/Header.test.tsx` 更新（活動履歴リンク）
  - `__tests__/components/layout/Footer.test.tsx` 更新（活動履歴リンク）
  - `__tests__/app/page.test.tsx` 更新（活動プレビュー）

**動作確認**:

- `npm run lint:fix && npm run format && npm run build` PASS
- `npm test` PASS
- ブラウザ:
  1. ナビに「活動履歴」が表示される（デスクトップ・モバイル両方）
  2. `/activity` ページが正常に表示される
  3. 活動が年別にグループ化されている
  4. カテゴリバッジが色分けされている
  5. トップページに活動プレビューが表示される
  6. プロジェクトサムネイルのサイズが統一されている
  7. ダークモードで正しく表示される

**依存**: Step 1-4（全ステップ完了前提）

---

## 参考: 各ステップ完了時点で何が動くか

| Step | 動く状態 |
| --- | --- |
| 1 完了 | ナビ日本語化、イントロ改善、CTA順序変更、スキル/プロジェクト並び替え完了。データ層の品質向上 |
| 2 完了 | トップページがコンテンツハブとして機能。全セクションのプレビュー＋動線あり |
| 3 完了 | About ページが充実。ページ内ナビ、アコーディオン、パーソナル情報、フッター誘導完備 |
| 4 完了 | 面接官が求める詳細情報（チーム規模・役割・スキルアイコン）が全揃い |
| 5 完了 | 6ページ構成のフルサイト完成。活動履歴ページ、写真統一、全改善項目完了 |

## 参考: ロールバック戦略

各ステップは独立してマージ可能なため、問題発生時は該当ステップの PR を revert するだけで回復する。ただし以下に注意:

- Step 1 を revert するとテストの文言が英語に戻るため、Step 2-5 のテストも影響を受ける
- Step 3 の `useSectionObserver` フックは client component なので、SSR 問題が発生した場合は `'use client'` ディレクティブを確認
- Step 5 のナビ項目追加は Header/Footer に影響するため、revert 時はテスト更新も必要

## 参考: Step 1 着手前の事前確認

- **新規依存追加**: なし（全て既存の lucide-react, next/image, tailwind で実現可能）
- **適性試験データの事前読み取り**: Step 3 着手前に `docs/20260505_適正試験結果` の内容を確認・構造化しておく
- **既存テストの状態確認**: `npm test` で全件 PASS を確認してから着手

## 参考: v2 以降で検討する機能

- **TiDB / Claude Code コラム**: トップページまたは About に Featured Tech セクションとして追加
- **E4**: カテゴリ別プロジェクト分類（技術プロジェクト / コミュニティ / 執筆）
- **Hero タイピングアニメーション**: Step 5 で CSS は用意するが、適用は余力次第
- **i18n 英語版**: メニューラベルを日本語にしたことで将来の英語版切り替えが容易に
- **OGP 画像自動生成**: 各ページ固有の OGP 画像
