# Step 1: コンテンツ・データ基盤 — 設計

## 変更ファイル一覧

| ファイル | 変更内容 |
|---------|---------|
| `src/types/index.ts` | `Skill` に `description?: string` 追加 |
| `src/data/navigation.ts` | 5ラベルを日本語化 |
| `src/data/metadata.ts` | introduction 書き直し + ビジョン追加 |
| `src/components/home/HeroSection.tsx` | CTA順序入替 + テキスト変更 |
| `src/data/skills.ts` | 強み順並替え + description追加 |
| `src/data/projects.ts` | アピール順並替え |
| `__tests__/` (4ファイル) | 文言修正 |

## 設計判断
- ナビラベル: ホーム / 経歴・スキル / サイドプロジェクト / ブログ / お問い合わせ
- CTA: 「経歴・スキルを見る」(primary/dark, /about/) + 「サイドプロジェクトを見る」(secondary/white, /projects/)
- スキル並び順: カテゴリ内で expert → advanced → intermediate
