# 設計: ポートフォリオ モダナイゼーション

承認済みプラン: `/home/vscode/.claude/plans/zany-stargazing-cray.md`

## 主要な設計判断

1. **Biome + ESLint ハイブリッド構成**（Phase 2）: eslint-config-next は Next.js 固有ルールのため残す。Biome がフォーマッティングと汎用 JS/TS リンティングを担当
2. **フォント変数名のリネーム**（Phase 3b → 4）: `--font-geist-sans-face` にすることで Tailwind v4 の `@theme` 変数との循環参照を回避
3. **`--spacing: 1px`**（Phase 4）: 基本単位を 1px にして `p-8` = `8px` を実現（現在のカスタムスケールと一致）
4. **既存カードのリファクタリングなし**（Phase 5）: shadcn Card/Badge/Button は将来用にインストールのみ。既存コンポーネントはそのまま
5. **Navigation → Sheet 置換**（Phase 5）: 134行の手動モーダル実装を Radix ベースの Sheet で置き換え、Header.tsx に統合
