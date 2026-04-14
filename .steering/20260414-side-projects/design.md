# Design: Phase 3-C2 — Side Projects

## 変更対象ファイル

| File | 変更内容 |
|------|---------|
| `src/types/index.ts` | Project に metrics / linkLabel 追加 |
| `src/data/navigation.ts` | label: 'Side Projects' |
| `src/data/projects.ts` | 新規3件 + 既存TiUG拡張 |
| `src/components/projects/ProjectCard.tsx` | metrics / linkLabel props + 表示 |
| `src/app/projects/page.tsx` | タイトル変更 + 新props渡し |
| `src/components/home/HeroSection.tsx` | CTA テキスト変更 |
| `__tests__/components/projects/ProjectCard.test.tsx` | metrics / linkLabel テスト |

## 設計判断

### メトリクス表示レイアウト
- highlights の下、technologies の上に横並び (`flex gap-32`)
- 各メトリクス: 値（大）+ ラベル（小）の縦組み
- デザイントークン: `text-sub-heading-large`（値）、`text-caption text-gray-400 font-medium`（ラベル）

### linkLabel の導入
- 既存: liveUrl のリンクテキストが `Connpass` にハードコード
- 変更後: `linkLabel ?? 'Live'` でデータ駆動に
- TiUG: `linkLabel: 'Connpass'` で既存表示を維持

### ProjectCard の props 設計
- `metrics` / `linkLabel` はすべて optional → 既存テスト破壊なし
- page.tsx からの props 渡し: `project.metrics` / `project.linkLabel` を直接渡す

### 新プロジェクトデータ
- resume facts に基づく事実のみ
- Amazon Kindle リンクは liveUrl として設定
- 勉強会は featured: false
