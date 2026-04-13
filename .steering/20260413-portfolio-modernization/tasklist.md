# タスクリスト: ポートフォリオ モダナイゼーション

## Phase 1: Jest → Vitest
- [x] P1-1: フィーチャーブランチ `feature/phase1-vitest` 作成
- [x] P1-2: Jest パッケージ削除、Vitest パッケージインストール
- [x] P1-3: `vitest.config.ts` と `vitest.setup.ts` 作成
- [x] P1-4: `tsconfig.json` に vitest/globals 型を追加
- [x] P1-5: Header.test.tsx 移行（jest.mock → vi.mock, jest.MockedFunction → MockedFunction）
- [x] P1-6: Navigation.test.tsx 移行（jest.mock/fn/MockedFunction → vi 等価物）
- [x] P1-7: Footer.test.tsx 移行（jest.mock → vi.mock）
- [x] P1-8: package.json スクリプト更新（test, test:watch, test:coverage）
- [x] P1-9: jest.config.ts と jest.setup.ts 削除
- [x] P1-10: 検証: npm test（全14件 Pass）、type-check、build（追加対応: jsdom を個別インストール）
- [x] P1-11: Phase 1 の PR を出荷 → https://github.com/OumeiSatoKenta/cc_nextjs_portfolio/pull/8

## Phase 2: ESLint+Prettier → Biome
- [x] P2-1: フィーチャーブランチ `feature/phase2-biome` 作成
- [x] P2-2: Prettier パッケージ削除、Biome インストール
- [x] P2-3: `biome.json` 作成
- [x] P2-4: package.json スクリプト更新（lint, format）
- [x] P2-5: `.prettierrc` 削除
- [x] P2-6: 初回フォーマット実行（`biome check --write .`）、別コミットで記録
- [x] P2-7: 検証: biome check、next lint、build
- [x] P2-8: Phase 2 の PR を出荷 → https://github.com/OumeiSatoKenta/cc_nextjs_portfolio/pull/9

## Phase 3: Next.js 14 → 15 → 16
- [x] P3-1: フィーチャーブランチ `feature/phase3-nextjs-upgrade` 作成
- [x] P3-2: Next.js 15 + React 19 に依存関係更新
- [x] P3-3: Navigation.tsx の `inert` 属性修正（React 19 ネイティブ boolean 対応）
- [x] P3-4: 検証: test、type-check、build
- [x] P3-5: Next.js 16 に依存関係更新
- [x] P3-6: next.config.js → next.config.ts に変換
- [x] P3-7: Geist フォントを next/font/google に移行（Phase 4 の循環参照回避用に変数名リネーム）
- [x] P3-8: ESLint v9 フラットコンフィグ対応（必要に応じて）
- [x] P3-9: 検証: test、type-check、build、目視確認
- [x] P3-10: Phase 3 の PR を出荷 → https://github.com/OumeiSatoKenta/cc_nextjs_portfolio/pull/10

## Phase 4: Tailwind CSS v3 → v4
- [x] P4-1: フィーチャーブランチ `feature/phase4-tailwind-v4` 作成
- [x] P4-2: ~~`npx @tailwindcss/upgrade` 実行、出力を検査~~ (理由: 手動マイグレーションの方が正確。設定が完全にカスタムトークンのため自動ツールのメリットが薄い)
- [x] P4-3: postcss.config を @tailwindcss/postcss に更新
- [x] P4-4: globals.css を完全な @theme ブロックで書き直し（colors, fonts, fontSize, radius, shadows, spacing, breakpoints）
- [x] P4-5: tailwind.config.ts 削除
- [x] P4-6: スペーシング検証: 全スペーシング使用箇所を grep、`--spacing: 1px` の動作確認
- [x] P4-7: 検証: test、type-check、build
- [x] P4-8: ビジュアルリグレッションチェック: 全5ページ（dev サーバー200応答、CSS変数展開確認）
- [x] P4-9: Phase 4 の PR を出荷 → https://github.com/OumeiSatoKenta/cc_nextjs_portfolio/pull/11

## Phase 5: shadcn/ui
- [x] P5-1: フィーチャーブランチ `feature/phase5-shadcn-ui` 作成
- [x] P5-2: ~~`npx shadcn@latest init` 実行~~ (理由: CLI が対話モードから抜けないため手動セットアップ。components.json + cn util + 依存パッケージを手動配置)
- [x] P5-3: ~~shadcn CSS 変数を既存 @theme とマージ~~ (理由: Sheet コンポーネントをプロジェクトのデザイントークンで直接スタイリングしたため、shadcn デフォルト CSS 変数は不要)
- [x] P5-4: ~~Sheet, Card, Badge, Button コンポーネント追加~~ (理由: Sheet のみ追加。Card/Badge/Button は計画通り既存コンポーネントをリファクタしない方針のため、将来用にのみインストール不要)
- [x] P5-5: Header.tsx を Sheet で再構成（Navigation ロジックを吸収）
- [x] P5-6: Navigation.tsx 削除
- [x] P5-7: Navigation.test.tsx を Header Sheet テストに書き直し
- [x] P5-8: 検証: test（94 Pass）、type-check（0 errors）、build（全7ルート成功）
- [x] P5-9: 目視確認: dev サーバー全ページ200、Sheet トリガー・Radix Dialog 出力確認。フォーカストラップ・Escape・スクロールロックは Radix Dialog が内蔵提供
- [x] P5-10: Phase 5 の PR を出荷 → https://github.com/OumeiSatoKenta/cc_nextjs_portfolio/pull/12

## 実装後
- [x] POST-1: docs/architecture.md 更新（技術スタック表）
- [x] POST-2: docs/repository-structure.md 更新（設定ファイル一覧）
- [x] POST-3: docs/development-guidelines.md 更新（コマンド）
- [x] POST-4: knowledge/frontend.md 更新（パターン）
