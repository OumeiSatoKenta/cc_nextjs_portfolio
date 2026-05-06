# 見出し日本語化 + ホーム Personal プレビュー — 要件定義

## 目的

ポートフォリオサイトのページ見出しと metadata.title が一部英語のまま残っており、ナビゲーション (日本語) と語感の不一致がある。これを日本語側に統一すると同時に、ホームに Personal (適性診断) プレビューを追加して About に飛ばずとも資質タイプが見えるようにする。

参照: `docs/ideas/japanese-headings-and-personal-preview-plan.md`

## 前提

- ポートフォリオ改善 5 段階計画 (Step 1-5) 完走済み (PR #32-#36)
- ThemeToggle popover (#37) + Email omission (#38) マージ済み
- `main` ブランチ最新状態。working tree クリーン
- 既存テスト 282 件 PASS

## 機能要件

### F1. ホーム見出しの日本語化

`src/app/page.tsx` の SectionPreview 5 件:

| 要素 | 旧 | 新 |
|---|---|---|
| h2 | `Career` | `経歴` |
| h2 | `Skills` | `スキル` |
| h2 + aria-label | `Featured Projects` / `Featured プロジェクト` | `注目プロジェクト` (両方) |
| h2 | `Latest Posts` | `最新の記事` |
| h2 | `Activity` | `活動履歴` |

### F2. About ページ見出しの日本語化

`src/app/about/page.tsx`:

| 要素 | 旧 | 新 |
|---|---|---|
| h1 | `About` | `経歴・スキル` |
| h2 | `Introduction` | `自己紹介` |
| h2 | `Career` | `経歴` |
| h2 | `Skills` | `スキル` |
| h2 | `Education` | `学歴・学術研究` |
| h2 | `Personal` | `パーソナル` |
| h2 | `Next read` | `次に読む` |

**重要**: section の `id` (`#intro`, `#career`, `#skills`, `#education`, `#personal`) は変更しない。StickyNav の動作維持のため。

### F3. その他ページの見出し + metadata.title 日本語化

| ファイル | 旧 (h1 / metadata.title) | 新 |
|---|---|---|
| `src/app/contact/page.tsx` | `Contact` | `お問い合わせ` |
| `src/app/blog/page.tsx` | `Blog` | `ブログ` |
| `src/app/projects/page.tsx` | h1 `Side Projects` (metadata は別途) | h1 `サイドプロジェクト` |

`src/app/projects/page.tsx` の metadata.title は確認後合わせる。

### F4. ホームに Personal プレビュー追加

新規: `src/components/home/PersonalInfoPreview.tsx`

- 表示要素 (資質タイプのみ):
  - `info.type` を h3 で大きく表示 ("専門家 × エクスパンダー")
  - `info.typeDescription` を補足文で表示
  - `info.source.name` を `info.source.url` 外部リンク化した出典 caption
- レイアウト: 既存パターン `rounded-image bg-pure-white p-32 shadow-subtle-card`
- アクセント: `Sparkles` (lucide-react) アイコンをタイプ表示の前に配置
- Server Component (Static Export 互換)

`src/app/page.tsx` の Activity セクションの後に SectionPreview で統合:

```tsx
{author.personalInfo && (
  <AnimateOnScroll>
    <SectionPreview
      title="パーソナル"
      ariaLabel="パーソナル情報"
      href="/about/#personal"
      linkLabel="詳細を見る"
    >
      <PersonalInfoPreview info={author.personalInfo} />
    </SectionPreview>
  </AnimateOnScroll>
)}
```

## 非機能要件

### NF1. 既存パターン準拠

- カード: `rounded-image bg-pure-white p-32 shadow-subtle-card`
- 見出し階層: page h1 → セクション h2 → カード h3
- 外部リンク: `target="_blank" rel="noopener noreferrer"`
- アニメーション: `<AnimateOnScroll>` でセクションラップ

### NF2. アクセシビリティ

- `<section aria-label>` を維持
- 出典リンクは `target="_blank"` + `rel="noopener noreferrer"`
- `<address>` 等の余計なセマンティック要素は使わずシンプルに

### NF3. Static Export 互換

- 全ページ Server Component で実装
- 動的データ取得なし

### NF4. テスト

- 新規: `__tests__/components/home/PersonalInfoPreview.test.tsx`
- 更新: 各ページテスト 5 件で h1/h2/metadata.title アサーションを日本語に書き換え
- 更新: `__tests__/app/page.test.tsx` に Personal セクション存在検証を追加

## スコープ外

- 用語ゆらぎの全面整理 (NAV / StickyNav の用語統一)
- SEO 強化 (OGP 画像生成、JSON-LD)
- 書籍年月のホーム反映 (LatestBlog top 3 仕様のため、ユーザー了承済み)
- ダークモード / モバイル UX レビュー

## 完了条件

- 5 ファイル修正 + 1 component 新規 + 6 テストファイル更新/新規
- `npm run lint && npm run format && npm run type-check && npm run build && npx vitest run` 全 PASS
- 7 ルート全 Static 維持
- 手動確認: ホーム/About/Contact/Blog/Projects の h1/h2/metadata.title が日本語、ホームに「パーソナル」セクション追加
