# 見出し日本語化 + ホーム Personal プレビュー — タスクリスト

## 実装タスク

### 1. PersonalInfoPreview コンポーネント新規作成

- [x] `src/components/home/PersonalInfoPreview.tsx` 新規作成

### 2. ホーム見出し日本語化 + PersonalInfoPreview 統合

- [x] `src/app/page.tsx` の h2 5 箇所を日本語化 (経歴 / スキル / 注目プロジェクト / 最新の記事 / 活動履歴)
- [x] Activity 後に PersonalInfoPreview を SectionPreview でラップして追加

### 3. About ページ見出し日本語化

- [x] h1 About → 経歴・スキル
- [x] h2 7 箇所 (自己紹介 / 経歴 / スキル / 学歴・学術研究 / パーソナル / 次に読む) を日本語化
- [x] section の id (`#intro` 〜 `#personal`) は不変を確認

### 4. Contact / Blog / Projects ページの日本語化

- [x] `src/app/contact/page.tsx`: metadata.title + h1 を `お問い合わせ`
- [x] `src/app/blog/page.tsx`: metadata.title + h1 を `ブログ`
- [x] `src/app/projects/page.tsx`: h1 を `サイドプロジェクト`

### 5. テスト

- [x] 新規: `__tests__/components/home/PersonalInfoPreview.test.tsx` (6 件)
- [x] 更新: `__tests__/app/page.test.tsx` (h2 アサーション更新 + パーソナル検証追加)
- [x] 更新: `__tests__/app/about/page.test.tsx` (h1 + h2 全部 + Next read / Personal を日本語に)
- [x] 更新: `__tests__/app/contact/page.test.tsx` (h1)
- [x] 更新: `__tests__/app/blog/page.test.tsx` (h1)
- [x] 更新: `__tests__/app/projects/page.test.tsx` (h1)

### 6. 検証

- [x] `npm run lint` PASS (warnings 5 のみ、既存)
- [x] `npm run format` PASS
- [x] `npm run type-check` PASS
- [x] `npm run build` PASS (7 ルート Static)
- [x] `npx vitest run` PASS (291/291、+9 件)

## レビューセクション

### 実装完了日
2026-05-06

### 実績サマリ
- 新規ファイル 2 件 (PersonalInfoPreview component + test)
- 変更ファイル 5 ページ + 5 テスト
- スコープ拡張 1 件: about/projects ページに `metadata` export を追加 (docs reviewer 必須指摘)
- テスト: 282 → 291 件 (+9 件) 全 PASS
- ビルド: 7 ルート全 Static 維持

### 計画と実績の差分
- requirements.md は contact/blog のみ metadata.title 変更を計画していたが、docs reviewer から `about` `projects` も `metadata` 欠落 ([必須]) を指摘されたため対応範囲を拡張
- 修正後 4 ページ全てで `<title>` が `ページ名 | サイト名` 形式に統一され、SEO・OGP の両面で効果が出る
- 既存 layout.tsx の `title.template: '%s | ${siteMetadata.name}'` の挙動を初めて全ルートで活用

### レビュー結果
- doc-reviewer (steering): 5/5、必須 0 件
- implementation-validator: 5/5、必須 0 件
- 3 軸コードレビュー:
  - structural: A/B、必須 0 件 (ExternalLink 提案はリポジトリに該当 component 不在のためスキップ)
  - defect/security: A/B、必須 0 件 (`javascript:` プロトコル防御は CLAUDE.md 「起こり得ない検証は追加しない」原則によりスキップ)
  - docs: B (修正後 A)、必須 1 件 → metadata 追加で対応

### 学んだこと
- Next.js の `metadata.title` template は子 segment が `metadata` を export していないと機能しない。layout で template を設定するだけでは不十分で、各ページで明示的に export する必要がある
- 「ホームの英語見出し残存」のような古いまま放置されがちなテキストは、ナビとセクション見出しでペアの整合性をチェックする方法 (Explore agent で `Career` などの英単語を grep) で網羅的に検出できる
- Server Component の `info.source && ...` 防御チェックは最小コストで undefined safety を担保できる

### 次回への改善提案
- 全ページの `metadata` export を持つことを architectural rule として `docs/development-guidelines.md` に追記すると今後の漏れ防止になる
- 用語ゆらぎ (NAV「経歴・スキル」 vs StickyNav「キャリア」) は次回の小さな refactor PR で整理する余地あり
