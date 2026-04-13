# 要求内容

## 概要

ポートフォリオサイトのコンテンツ空白を埋め、Phase 2〜5 のUI強化の土台となるデータを整備する。変更対象はデータファイル・型定義・アイコンコンポーネントのみ（UIレイアウト変更なし）。

## 背景

技術スタックのモダナイゼーション（Phase 1〜5）が完了済み。ポートフォリオは Next.js 16 + Tailwind v4 + shadcn/ui + Vitest + Biome で稼働中。現状の課題:

- ブログ記事 4/6 件に `description` なし → Blog ページでカードに説明文が表示されない
- LinkedIn リンクなし → ソーシャルリンクが GitHub / connpass / Mail のみ
- スキルに経験年数なし → レベルバッジのみで具体性に欠ける
- ヒーロー統計データなし → Phase 4 のヒーローセクション強化で使用する `stats` データが未定義

## 実装対象の機能

### 1. ブログ記事 description 追加

- `src/data/blog.ts` の description 未設定 4 記事に 1 行サマリーを追加
- 対象: DevContainer AWS 記事 / TiDB Cloud Zero 記事 / DevContainer Claude Code voice 記事 / ローカル環境 TiDB 記事

### 2. LinkedIn ソーシャルリンク追加

- `src/data/social.ts` に LinkedIn エントリを追加
- `src/components/icons/LinkedinIcon.tsx` を新規作成し、`SocialIcon.tsx` の `iconMap` に登録（GithubIcon と同じ 2 ファイル分割パターン）

### 3. スキル経験年数の追加

- `src/types/index.ts` の `Skill` インターフェースにオプショナル `years?: number` フィールドを追加
- `src/data/skills.ts` に履歴書情報ベースの年数を付与
- `src/components/about/SkillGrid.tsx` でバッジテキストに年数を表示（`{skill.name} · {skill.years}y` 形式）

### 4. ヒーロー統計データ定義

- `src/types/index.ts` の `SiteMetadata.author` に `stats: { label: string; value: string }[]` を追加
- `src/data/metadata.ts` に履歴書由来の 3 項目を設定
- ※ 表示は Phase 4 で実装。本フェーズはデータ定義のみ

## 受け入れ条件

### ブログ description
- [ ] 6 記事すべてに `description` が設定されている
- [ ] `description` は日本語で 1 行、記事の内容を正確に要約している

### LinkedIn リンク
- [ ] Contact ページに LinkedIn リンクが表示される
- [ ] LinkedIn アイコンが正しく描画される
- [ ] リンク URL が `https://www.linkedin.com/in/kenta-sato-4180aa252/` である

### スキル年数
- [ ] `Skill` 型に `years?: number` が追加されている
- [ ] 全 20 スキルに `years` が設定されている（履歴書準拠）
- [ ] About ページのスキルバッジに `スキル名 · Ny` 形式で年数が表示される

### ヒーロー統計データ
- [ ] `SiteMetadata.author` に `stats` 配列が追加されている
- [ ] 3 項目のデータが定義されている
- [ ] `npm run type-check` が通る

## 成功指標

- `npm test` / `npm run lint` / `npm run type-check` / `npm run build` がすべてエラーゼロで成功
- 既存テストが全パス（regression なし）

## スコープ外

以下はこのフェーズでは実装しません:

- カテゴリ別バッジカラー（Phase 2）
- カードホバーリフト（Phase 2）
- スクロールアニメーション（Phase 3）
- ヒーロー統計カードの表示（Phase 4）
- フッターのマルチセクション化（Phase 5）

## 参照ドキュメント

- `docs/ideas/content-ux-enrichment.md` - エンリッチメント計画（Phase 1 セクション）
- `docs/product-requirements.md` - プロダクト要求定義書
- `docs/architecture.md` - アーキテクチャ設計書
- `docs/development-guidelines.md` - 開発ガイドライン
- `DESIGN.md` - デザインシステム
