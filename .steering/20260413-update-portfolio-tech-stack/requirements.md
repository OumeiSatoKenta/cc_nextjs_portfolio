# 要件: Portfolio Site 技術スタック表示の更新

## 背景
Phase 1〜5 のモダナイゼーション完了に伴い、`src/data/projects.ts` の Portfolio Site エントリが旧スタック（Next.js 14, Tailwind CSS, Jest）のまま残っている。

## 変更内容
1. `description` テキストを最新スタックに更新（Next.js 16, Tailwind CSS v4, Vitest, Biome, shadcn/ui）
2. `technologies` 配列を最新スタックに更新
3. `highlights` に shadcn/ui やモダナイゼーションの成果を反映（必要に応じて）
