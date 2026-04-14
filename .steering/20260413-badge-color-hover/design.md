# Design: カテゴリ別バッジカラー + カードホバーリフト

## D1: カラートークン設計

### 新規バッジカラートークン（globals.css @theme に追加）

DESIGN.md のワークフローアクセントカラーの淡い背景版。各カテゴリに対応:

| カテゴリ | ベースカラー | bg トークン | text トークン |
|---------|-------------|------------|--------------|
| cloud | Develop Blue (#0a72ef) | `--color-badge-cloud-bg: #ebf5ff` | `--color-badge-cloud-text: #0052cc` |
| language | Preview Pink (#de1d8d) | `--color-badge-lang-bg: #fdf2f8` | `--color-badge-lang-text: #b31472` |
| database | Ship Red (#ff5b4f) | `--color-badge-db-bg: #fff5f5` | `--color-badge-db-text: #b83028` |
| tool | Gray (#4d4d4d) | `--color-badge-tool-bg: #f5f5f5` | `--color-badge-tool-text: #4d4d4d` |

### コントラスト比の検証

レビューで cloud/lang/db の全てが WCAG AA 4.5:1 未達であることが判明。テキスト色をワークフローアクセントカラーの暗い派生値に修正:

| 組み合わせ | テキスト色 | 背景色 | 推定比率 | AA準拠 |
|-----------|----------|--------|---------|--------|
| cloud | #0052cc on #ebf5ff | ~6.6:1 | OK |
| language | #b31472 on #fdf2f8 | ~5.2:1 | OK |
| database | #b83028 on #fff5f5 | ~5.4:1 | OK |
| tool | #4d4d4d on #f5f5f5 | ~5.8:1 | OK |

## D2: SkillGrid バッジカラーマッピング

現状の `LEVEL_BADGE_CLASS` マップを `CATEGORY_BADGE_CLASS` に置換する形で拡張。expert は引き続き黒バッジ。

```ts
const CATEGORY_BADGE_CLASS: Record<SkillCategory, string> = {
  cloud: 'bg-badge-cloud-bg text-badge-cloud-text',
  language: 'bg-badge-lang-bg text-badge-lang-text',
  database: 'bg-badge-db-bg text-badge-db-text',
  tool: 'bg-badge-tool-bg text-badge-tool-text',
};
```

バッジクラス決定ロジック:
1. `skill.level === 'expert'` → `'bg-vercel-black text-pure-white'`（現行通り）
2. それ以外 → `CATEGORY_BADGE_CLASS[skill.category]`

### 変更点

- `LEVEL_BADGE_CLASS` マップを削除
- `CATEGORY_BADGE_CLASS` マップを新規定義
- バッジの className で expert 判定 → カテゴリマップ参照

## D3: BlogCard プラットフォームバッジカラー

DESIGN.md の「Don't introduce warm colors」制約に従い、既存パレットの再利用で視覚的区別を実現:

| プラットフォーム | カラー | 理由 |
|---------------|--------|------|
| zenn | badge-cloud (blue) | Zenn のブランドカラーが青系 |
| qiita | badge-lang (pink) | 視覚的区別のため |
| amazon | badge-db (red) | Amazon 系のアクセントとして |
| note | badge-tool (gray) | ニュートラル |
| other | badge-tool (gray) | デフォルト |

```ts
const PLATFORM_BADGE_CLASS: Record<BlogPlatform, string> = {
  zenn: 'bg-badge-cloud-bg text-badge-cloud-text',
  qiita: 'bg-badge-lang-bg text-badge-lang-text',
  amazon: 'bg-badge-db-bg text-badge-db-text',
  note: 'bg-badge-tool-bg text-badge-tool-text',
  other: 'bg-badge-tool-bg text-badge-tool-text',
};
```

## D4: カードホバーリフト

全対象カードの `<article>` に以下を適用:

- `transition-shadow` → `transition-all` に変更（translate アニメーションを含むため）
- `hover:-translate-y-1` を追加（1px = 微小な浮き上がり。-2 だと大きすぎる可能性）

Tailwind v4 の `translate-y-*` は `--spacing` スケールに従う。`--spacing: 1px` の場合:
- `hover:-translate-y-4` = 4px のリフト（視認性がありつつ上品）

`transition-all` ではなく `transition` を使用。Tailwind v4 の `transition` は `box-shadow`, `translate`, `transform` 等のよく使うプロパティに限定されており、`transition-all`（全プロパティ）よりパフォーマンスが良い。

### 対象コンポーネントの変更パターン

```
変更前: className="... transition-shadow hover:shadow-full-card"
変更後: className="... transition hover:-translate-y-4 hover:shadow-full-card"
```

**StrengthCard 特記**: 現在 `transition-shadow` や `hover:shadow-full-card` がない。追加する。

## D5: 変更対象ファイル一覧

| ファイル | 変更内容 |
|---------|---------|
| `src/app/globals.css` | @theme にバッジカラートークン 8 個追加 |
| `src/components/about/SkillGrid.tsx` | LEVEL_BADGE_CLASS → CATEGORY_BADGE_CLASS + expert 判定 |
| `src/components/blog/BlogCard.tsx` | PLATFORM_BADGE_CLASS 追加 + ホバーリフト |
| `src/components/projects/ProjectCard.tsx` | ホバーリフト |
| `src/components/contact/SocialLinkCard.tsx` | ホバーリフト |
| `src/components/home/StrengthCard.tsx` | ホバーリフト |
| `__tests__/components/about/SkillGrid.test.tsx` | バッジクラスアサーション更新 |
| `__tests__/components/blog/BlogCard.test.tsx` | プラットフォームバッジクラスアサーション更新 |
