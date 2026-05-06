# Step 5: 活動履歴ページ + ビジュアル仕上げ — 要件定義

## 目的

ポートフォリオ改善 5 段階計画の最終ステップ。「活動履歴」を独立した第 6 ページとして新設し、コミュニティ・登壇・執筆など継続的な活動を年別タイムラインで一覧化する。あわせてプロジェクトサムネイルの写真サイズ統一とビジュアル仕上げを実施。

参照: `docs/ideas/portfolio-revision-plan.md` (Step 5 範囲のみ)

## 前提

- Step 1-4 完了済み（ナビ日本語化、Hub 化、About 強化、メタデータ + アイコン）
- 既存テスト 231 件 PASS
- ナビゲーションは `src/data/navigation.ts` の単一ソース。Header / Footer は data-driven（リンク追加時の影響範囲は data + テスト 2 件のみ）

## 機能要件

### F1. Activity 型 + データ追加

- `src/types/index.ts` に新規追加:
  - `ActivityCategory = 'meetup' | 'conference' | 'study-group' | 'oss' | 'publication' | 'other'`
  - `Activity` interface: `id`, `title`, `date`, `category`, `description`, `role?`, `url?`, `tags?`
- `src/data/activities.ts` (新規): 活動履歴データ
  - 既存資料 (`careers`, `projects`, `blogPosts`) から確証ある活動のみ抽出:
    - TiUG (TiDB User Group) 運営: 2024 年 3 月開始
    - 書籍 2 冊: AWS SAA 教科書 / Amplify ハンズオン
    - JAWS / 生成 AI 勉強会への継続参加
  - 新規データを発明しない（CLAUDE.md ルール準拠）

### F2. ナビゲーション拡張

- `src/data/navigation.ts` の NAV_LINKS に「活動履歴」(`/activity`) を Blog の前に追加
- Header / Footer / モバイルメニューすべてに自動反映（data-driven）
- テスト更新: `__tests__/components/layout/{Header,Footer}.test.tsx`

### F3. `/activity` ページ新設

- `src/app/activity/page.tsx` (新規): メタデータ + ActivityTimeline レンダリング
- `src/components/activity/ActivityTimeline.tsx` (新規): 年別 (`date.slice(0, 4)`) グループ化、降順ソート
- `src/components/activity/ActivityCard.tsx` (新規): カテゴリカラーバッジ + タイトル + 日付 + 説明 + 任意リンク
- カテゴリカラーマップ:
  - `meetup` → `bg-badge-cloud-bg text-badge-cloud-text` (青)
  - `conference` → `bg-badge-db-bg text-badge-db-text` (赤)
  - `study-group` → `bg-badge-lang-bg text-badge-lang-text` (ピンク)
  - `publication` → `bg-vercel-black text-pure-white` (黒)
  - `oss`, `other` → `bg-badge-tool-bg text-badge-tool-text` (グレー)

### F4. トップページに活動プレビュー追加

- `src/components/home/ActivityPreview.tsx` (新規): 最新 3 件をシンプルに列挙（年 + タイトル + カテゴリバッジ）
- `src/app/page.tsx` の LatestBlog の後に `<SectionPreview title="Activity" linkLabel="すべての活動を見る" href="/activity/">` で統合
- ホームでは ActivityCard ではなく軽量な行リスト表現（ハブ全体の縦長化抑制）

### F5. プロジェクトサムネイル写真サイズ統一

- `src/components/projects/ProjectThumbnail.tsx` の固定高 `h-180` を `aspect-[16/9]` + `h-auto` に変更
- すべてのプロジェクト (collider/airshower 等) で 16:9 比率に統一
- 既存テスト (`__tests__/components/projects/ProjectThumbnail.test.tsx`) はクラス値検証なら更新が必要

### F6. (任意) Hero タイピングアニメーション

- 計画書では「余力があれば」と明記。Step 5 では実装を**スキップ**する判断:
  - 理由 1: タイピングアニメーションは可読性とアクセシビリティのトレードオフが大きい (`prefers-reduced-motion` だけでなく、スクリーンリーダーでの読み上げが断続化する)
  - 理由 2: ハブ化と詳細メタデータが揃った今、装飾より中身の磨き込みを優先
  - 理由 3: 計画書も明示的に「余力があれば」と条件付き記載
- スコープ外として明記し、tasklist にも入れない。将来要望があれば別 PR で実装

## 非機能要件

### NF1. 既存パターン準拠

- レイアウト: `mx-auto max-w-[1200px] px-16 md:px-32 py-40`
- 見出し階層: page `<h1>` → セクション `<h2>` → カード `<h3>`
- カード: `rounded-comfortable bg-pure-white p-32 shadow-subtle-card`
- バッジ: `rounded-pill px-10 py-3 text-caption`
- アニメーション: `<AnimateOnScroll>` でセクションラップ

### NF2. アクセシビリティ

- `<section aria-label>` 必須
- カテゴリバッジは色 + テキストで意味伝達（色のみに依存しない）
- 外部リンクは `target="_blank" rel="noopener noreferrer"`

### NF3. Static Export 互換

- 全ページ Server Component で実装可能
- 動的データ取得なし、ビルド時にデータが固定

### NF4. テスト

- 新規 4 件: ActivityCard, ActivityTimeline, ActivityPreview, /activity/page
- 更新: Header / Footer は data-driven なので NAV_LINKS 変更で自動追従 (実質変更なし)。app/page は活動セクション検証で更新。ProjectThumbnail は `aspect-[16/9]` クラス検証が現テストに無いため、必要に応じて追加

## スコープ外

- Hero タイピングアニメーション (F6 で明示)
- プロジェクト 個別ページの新設
- 活動データの動的フェッチ (Connpass API など)

## 完了条件

- 型 + データ + 4 コンポーネント + 1 ページ + 1 hub プレビュー実装完了
- 既存テスト 3 件更新 + 新規テスト 4 件追加
- `npm run lint && npm run format && npm run type-check && npm run build && npx vitest run` 全 PASS
- 6 ページ構成のサイトとして手動確認 (ナビ・タイムライン・カード・プレビュー)
