# Design: プロジェクトサムネイル (U5)

## アクセントカラーのグラデーション

| accentColor | CSS gradient | Lucide icon color |
|-------------|-------------|-------------------|
| ship (red) | `from-ship-red/20 to-ship-red/5` | `text-ship-red` |
| preview (pink) | `from-preview-pink/20 to-preview-pink/5` | `text-preview-pink` |
| develop (blue) | `from-develop-blue/20 to-develop-blue/5` | `text-develop-blue` |

## プロジェクト-サムネイルマッピング

| Project | accentColor | icon (Lucide) |
|---------|-------------|---------------|
| Portfolio Site | develop | Globe |
| Portfolio Infra | ship | Cloud |
| TiUG | preview | Users |
| AWS 認定資格本 | ship | BookOpen |
| Amplify 本 | develop | PenTool |
| JAWS/生成AI | preview | Presentation |

## ProjectThumbnail コンポーネント設計

```
┌────────────────────────────────────────┐
│  bg-gradient-to-br from-{color}/20    │  h-[180px]
│              to-{color}/5              │  rounded-image (12px)
│                                        │
│            [Lucide Icon]               │  48px, opacity-60
│                                        │
└────────────────────────────────────────┘
```

- `iconMap` パターン（SocialIcon.tsx と同じ）で文字列→コンポーネントを解決
- `grid place-items-center` で中央配置

## ProjectCard 変更

- `overflow-hidden` を article に追加
- `rounded-comfortable` → `rounded-image` でサムネイルの角丸と一致
- サムネイルは `-mx-32 -mt-32 mb-16` の負マージンでカードパディングを打ち消し
- `thumbnail` prop は optional（後方互換）

## 影響ファイル

| ファイル | 変更 |
|---------|------|
| `src/types/index.ts` | `ProjectAccentColor`, `ProjectThumbnail` 型追加、`Project.thumbnail` |
| `src/data/projects.ts` | 全 6 件に `thumbnail` データ追加 |
| `src/components/projects/ProjectThumbnail.tsx` | **新規** |
| `src/components/projects/ProjectCard.tsx` | `thumbnail` prop + overflow-hidden |
| `src/app/projects/page.tsx` | `thumbnail` prop を渡す |
| `__tests__/components/projects/ProjectCard.test.tsx` | サムネイルテスト追加 |
