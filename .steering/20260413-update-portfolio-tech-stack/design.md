# 設計: Portfolio Site 技術スタック表示の更新

## 変更対象
- `src/data/projects.ts` L6-16（Portfolio Site エントリ）

## 変更内容

### description
旧: `Next.js 14 App Router + Static Export ... Tailwind CSS ... Jest + React Testing Library ... GitHub Actions CI/CD`
新: `Next.js 16 App Router + Static Export ... Tailwind CSS v4 + shadcn/ui ... Vitest + React Testing Library ... Biome ... GitHub Actions CI/CD`

### technologies
旧: `['Next.js', 'TypeScript', 'Tailwind CSS', 'Jest', 'GitHub Actions']`
新: `['Next.js 16', 'TypeScript', 'Tailwind CSS v4', 'shadcn/ui', 'Vitest', 'Biome', 'GitHub Actions']`

### highlights
3つ目は現行のまま。1つ目・2つ目も現行のまま（内容は依然として正確）。

## テスト影響
- ProjectCard テストは `technologies` 配列の特定値をアサートしている可能性がある → 確認が必要
