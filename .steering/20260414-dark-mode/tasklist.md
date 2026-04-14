# タスクリスト: ダークモード対応 (U4)

## フェーズ1: 依存関係とCSS基盤

- [x] 1-1. next-themes をインストール (`npm install next-themes`)
- [x] 1-2. `src/app/globals.css` に `@custom-variant dark` を追加
- [x] 1-3. `src/app/globals.css` に `:root { color-scheme: light; }` と `.dark { color-scheme: dark; ... }` を追加（全カラー・シャドウトークン）
- [x] 1-4. `src/app/globals.css` に `.dark .hero-gradient { ... }` を追加

## フェーズ2: ThemeProvider + Layout統合

- [x] 2-1. `src/components/providers/ThemeProvider.tsx` を新規作成
- [x] 2-2. `src/app/layout.tsx` に `suppressHydrationWarning` と `<ThemeProvider>` を統合

## フェーズ3: ThemeToggle + Header統合

- [x] 3-1. `src/components/ui/ThemeToggle.tsx` を新規作成
- [x] 3-2. `src/components/layout/Header.tsx` に ThemeToggle を配置

## フェーズ4: テスト

- [x] 4-1. `__tests__/components/ui/ThemeToggle.test.tsx` を新規作成
- [x] 4-2. 既存テストが通ることを確認 (`npm run test`)
- [x] 4-3. 型チェック通過 (`npm run type-check`)
- [x] 4-4. Lint 通過 (`npm run lint`)
- [x] 4-5. ビルド通過 (`npm run build`)
- [x] 4-6. `docs/architecture.md` のダークモード記載を CSS変数スワップ方式に更新

## 実装後の振り返り

### 検証結果
- テスト: 127 passed (18 files) — 新規6テスト + 既存テスト全通過
- 型チェック: `tsc --noEmit` 通過
- Lint: Biome + ESLint 通過（既存 `noArrayIndexKey` warning 3件のみ）
- ビルド: `next build` 成功（全7ページ static export）

### 実装アプローチの評価
CSS変数スワップ方式は正解だった。既存の19コンポーネントに `dark:` クラスを個別追加する必要がなく、`globals.css` の `.dark` ブロックでトークンを再定義するだけで全コンポーネントが自動対応。変更ファイルは6ファイル（新規3 + 既存3修正）に収まった。

### 注意点・教訓
1. **CSS specificity 順序**: `.dark .hero-gradient` は `.hero-gradient` の後に配置する必要がある（Biome `noDescendingSpecificity` ルール）
2. **ESLint `react-hooks/set-state-in-effect`**: `useEffect(() => setMounted(true), [])` はnext-themesのハイドレーション対策として正当なパターンだが、ESLintが警告するため `eslint-disable-line` + 理由コメントで対処
3. **Tailwind CSS v4**: `@custom-variant dark (&:is(.dark *));` の構文が必要（v3の `darkMode: ['class']` とは異なる）

### 変更ファイル一覧
| ファイル | 変更種別 |
|---------|---------|
| `package.json` / `package-lock.json` | next-themes 追加 |
| `src/app/globals.css` | dark variant, .dark 変数, .dark .hero-gradient |
| `src/components/providers/ThemeProvider.tsx` | 新規作成 |
| `src/app/layout.tsx` | ThemeProvider 統合, suppressHydrationWarning |
| `src/components/ui/ThemeToggle.tsx` | 新規作成 |
| `src/components/layout/Header.tsx` | ThemeToggle 配置 |
| `__tests__/components/ui/ThemeToggle.test.tsx` | 新規作成 |
| `docs/architecture.md` | ダークモード実装済に更新 + next-themes 追記 |
| `DESIGN.md` | ダークモードカラーパレットセクション追加 |
