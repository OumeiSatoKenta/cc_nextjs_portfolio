# タスクリスト: コンタクトページ（F5: /contact）

## Phase 1: データ更新

- [x] T1-1: `src/data/social.ts` に connpass エントリを追加
- [x] T1-2: `docs/functional-design.md` の SocialLinkCardProps を flat props パターンに更新

## Phase 2: SocialLinkCard 実装

- [x] T2-1: `src/components/contact/SocialLinkCard.tsx` を実装
- [x] T2-2: `__tests__/components/contact/SocialLinkCard.test.tsx` を作成

## Phase 3: ページ統合

- [x] T3-1: `src/app/contact/page.tsx` を書き換え（h1 + SocialLinkCard グリッド）
- [x] T3-2: `__tests__/app/contact/page.test.tsx` を作成

## Phase 4: 品質検証

- [x] T4-1: `npm run lint` がエラーなく成功する
- [x] T4-2: `npm run type-check` がエラーなく成功する
- [x] T4-3: `npm test` が全件 PASS する — 100 / 100 passed
- [x] T4-4: `npm run build` が成功し `out/contact/index.html` が生成される

## Phase 5: レビュー

- [x] T5-1: `implementation-validator` サブエージェントで実装検証 — 5/5
- [x] T5-2: 3 軸コードレビュー（structural / secondary-security / docs）を並列実行 — structural: B, security: B/C, docs: B/C
- [x] T5-3: レビュー指摘を反映し、総合評価 B 以上・`[必須]` 0 件にする — isExternalHttpUrl 共有化, font-medium 重複削除, key 修正, aria-hidden 追加

## Phase 6: 振り返り

- [x] T6-1: 本ファイルに「振り返り」セクションを追加
- [x] T6-2: 必要に応じて `docs/` 永続ドキュメントを更新 — functional-design.md SocialLinkCardProps を flat props に更新

---

## 振り返り

### 実装完了日
2026-04-13

### 計画と実績の差分
- **計画通り**: SocialLinkCard コンポーネント、Contact ページ、connpass 追加、テスト — すべて計画通りに完了
- **追加作業**: コードレビューで `isExternalHttpUrl` を `src/lib/url.ts` に共有化（Footer.tsx もリファクタ）、`font-medium` 重複削除、`key` 修正、`aria-hidden` 追加
- **スコープ維持**: SectionHeading 共通化は F1-F4 も未使用のため将来タスクとして据え置き

### 学んだこと
- `isExternalHttpUrl` のような小さなユーティリティでも 2 箇所以上で使う場合は `src/lib/` に抽出すべき — Footer + SocialLinkCard で発生
- `text-body-medium` のような Tailwind カスタムユーティリティが `font-weight` を内包する場合、`font-medium` は冗複になる — tailwind.config.ts の定義を事前確認する
- lucide-react/dynamic の DynamicIcon はテスト時に `jest.mock` が必須 — Footer テストと同じパターンで対処

### 次回への改善提案
- `SectionHeading` 共通コンポーネントを実装し、全ページの h1 + subtitle パターンを統一する
- social.ts のプレースホルダー URL（github.com/username 等）を本番デプロイ前に実 URL に差し替える
- `DynamicIcon` のフォールバック（無効なアイコン名対応）を検討する
