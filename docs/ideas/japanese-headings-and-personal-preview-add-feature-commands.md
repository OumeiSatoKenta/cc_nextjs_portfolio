# 見出し日本語化 + ホーム Personal プレビュー — `/add-feature` 実行コマンド

本書は [japanese-headings-and-personal-preview-plan.md](./japanese-headings-and-personal-preview-plan.md) の実装を **1 つの `/add-feature` コマンド** に集約したものである。中規模タスクのため 1 PR / 1 ステップで完結する。

**重要**: コマンドプロンプトには「参照ドキュメント: `docs/ideas/japanese-headings-and-personal-preview-plan.md`」が含まれており、実装時は同プランを参照しながら該当範囲のみを実装する。

**前提**: ポートフォリオ改善 5 段階計画 (Step 1-5) 完走済み (PR #32-#36 マージ済み) + Theme Toggle popover (#37) + Email omission (#38) 完了

---

## 実行順の全体像

```
Step 1 (only): 見出し日本語化 + Personal プレビュー
   ← 完了時点で「全ページ h1/h2/metadata.title が日本語、ホーム Hub に Personal セクション追加」
```

**ポイント**:

- 単一 PR でレビュー可能な粒度に収まる (修正 5 ページ + 新規 1 component + tests)
- 既存ナビ id は変更しないため StickyNav 動作影響なし
- `metadata.title` 日本語化は副次的に SEO とブラウザタブ表示の改善

---

## Step 1: 見出し日本語化 + ホーム Personal プレビュー

```
/add-feature ポートフォリオ改善 見出し日本語化と Personal プレビュー: ホーム/About/Contact/Blog/Projects の h1/h2/metadata.title を日本語に統一 (Career→経歴、Skills→スキル、About→経歴・スキル、Featured Projects→注目プロジェクト 等)、ホームの Activity セクション後に資質タイプのみのパーソナルプレビュー (PersonalInfoPreview) を SectionPreview で追加。参照ドキュメント: docs/ideas/japanese-headings-and-personal-preview-plan.md (該当ステップ範囲のみ実装)
```

**実装内容**:

### 修正

- `src/app/page.tsx`
  - h2 `Career` → `経歴`
  - h2 `Skills` → `スキル`
  - h2 `Featured Projects` → `注目プロジェクト` + aria-label `Featured プロジェクト` → `注目プロジェクト`
  - h2 `Latest Posts` → `最新の記事`
  - h2 `Activity` → `活動履歴`
  - Activity セクション後に `<PersonalInfoPreview>` を `SectionPreview` でラップして追加 (`author.personalInfo` 存在時のみ)
- `src/app/about/page.tsx`
  - h1 `About` → `経歴・スキル`
  - h2 `Introduction` → `自己紹介`
  - h2 `Career` → `経歴`
  - h2 `Skills` → `スキル`
  - h2 `Education` → `学歴・学術研究`
  - h2 `Personal` → `パーソナル`
  - h2 `Next read` → `次に読む`
- `src/app/contact/page.tsx`
  - `metadata.title: 'Contact'` → `'お問い合わせ'`
  - h1 `Contact` → `お問い合わせ`
- `src/app/blog/page.tsx`
  - `metadata.title: 'Blog'` → `'ブログ'`
  - h1 `Blog` → `ブログ`
- `src/app/projects/page.tsx`
  - h1 `Side Projects` → `サイドプロジェクト`

### 新規

- `src/components/home/PersonalInfoPreview.tsx`
  - props: `info: PersonalInfo`
  - 表示要素:
    - 資質タイプ大見出し (`info.type`)
    - 補足文 (`info.typeDescription`)
    - 出典 caption (`info.source.name` を `info.source.url` 外部リンク化)
  - レイアウト: `rounded-image bg-pure-white p-32 shadow-subtle-card` カード
  - Sparkles 等のアイコンで視覚アクセント
  - Server Component (Static Export 互換)
- `__tests__/components/home/PersonalInfoPreview.test.tsx`
  - 資質タイプの h3 表示
  - 補足文表示
  - 出典リンクの target/rel 検証

### テスト更新

- `__tests__/app/page.test.tsx`
  - 既存 h2 アサーションを日本語に書き換え
  - Personal セクション (`'パーソナル情報'` aria-label) の存在検証を追加
- `__tests__/app/about/page.test.tsx`
  - h1 + h2 全アサーションを日本語に書き換え
- `__tests__/app/contact/page.test.tsx`
  - h1 アサーションを `お問い合わせ` に
- `__tests__/app/blog/page.test.tsx`
  - h1 アサーションを `ブログ` に
- `__tests__/app/projects/page.test.tsx`
  - h1 アサーションを `サイドプロジェクト` に

**動作確認手順**:

1. `npm run dev` でローカル起動
2. `/` (ホーム): h2 全 6 件 (経歴 / スキル / 注目プロジェクト / 最新の記事 / 活動履歴 / パーソナル) が日本語
3. ホーム最下部に「パーソナル」セクション表示、資質タイプ + 説明 + アッテルリンク
4. `/about`: h1 が「経歴・スキル」、StickyNav 項目クリックで該当セクションにスクロール (id 不変)
5. `/contact` `/blog` `/projects`: ブラウザタブが日本語タイトル
6. 自動ゲート: `npx vitest run && npm run lint && npm run type-check && npm run build` 全 PASS

**依存**: なし (Step 5 + 後続 PR #37 #38 完了済み main から分岐)

---

## ステップ完了時点で何が動くか

| ステップ | 完了後の状態 |
|---|---|
| Step 1 | 全ページの h1/h2/metadata.title が日本語、ホーム Hub に Personal プレビュー追加完了。CI 緑、7 ルート全 Static |

---

## ロールバック戦略

- 単一 PR のため revert は通常 1 コミット (または squash merge 後の 1 PR revert) で完結
- 万が一 StickyNav が壊れた場合: section の id (`#intro`, `#career` 等) は変更していないため、h2 テキストの差し戻しのみで復旧可能

---

## 事前確認事項

- `npm run build` が現状 main で 7 ルート全 Static で通ることを確認済み
- LatestBlog が書籍を含まないことをユーザー了承済み (本計画のスコープ外)
- パーソナルプレビューは「資質タイプのみ」(topQualities や selfAwareness は About 限定) でユーザー合意済み

---

## v2 以降で検討する機能 (今回スコープ外)

- 用語ゆらぎ統一 (NAV「経歴・スキル」 vs StickyNav「キャリア」など)
- SEO 強化 (OGP 画像 / JSON-LD)
- Activity ページのカテゴリフィルター
- 書籍を Featured Projects に含めるか
- ダークモード時の視認性レビュー
- モバイル UX 確認
- Education ヒーロー画像の lightbox
