# 見出し日本語化 + ホーム Personal プレビュー — 実装計画

## Context

ポートフォリオ改善 5 段階計画 (`portfolio-revision-plan.md`) 完走後、ユーザーから次の改善要望が出た:

1. **言語混在の解消**: ヘッダー・NAV は日本語化済みだが、ホームと各ページの h1/h2 (`Career`, `Skills`, `About`, `Contact`, `Blog`, `Side Projects` など) が英語のまま残り、`metadata.title` も英語のまま。日本語側に統一したい。
2. **ホームにパーソナル適性プレビュー**: About 配下にある `PersonalInfo` (資質タイプ「専門家 × エクスパンダー」など) はホームに表示されていない。資質タイプのみの軽量プレビューを追加したい。
3. **書籍年月のホーム反映**: ユーザー確認の結果、LatestBlog が `publishedAt` 降順 top 3 で最新ブログ記事のみを表示しており、SAA (2022-08) / Amplify (2023-09) 書籍は古いため対象外であることを了承済み。**アクション不要**。

**ユーザーの要件確認結果**:

- パーソナルプレビューの粒度: **資質タイプのみ** (typeDescription + アッテル出典 caption 含む。topQualities や selfAwareness はホームには載せない)
- スコープ: **3 つの主題を 1 PR で**
- 段階分割: **1 ステップで完結** (中規模タスクのため、`/add-feature-planning` の段階分割指針に従い 1 ステップ実装)

---

## 設計サマリ

### A. 見出し・メタデータの日本語化

| ファイル | 旧 | 新 |
|---|---|---|
| `src/app/page.tsx` | h2 `Career` | `経歴` |
| `src/app/page.tsx` | h2 `Skills` | `スキル` |
| `src/app/page.tsx` | h2 `Featured Projects` + aria-label `Featured プロジェクト` | `注目プロジェクト` (両方) |
| `src/app/page.tsx` | h2 `Latest Posts` | `最新の記事` |
| `src/app/page.tsx` | h2 `Activity` | `活動履歴` |
| `src/app/about/page.tsx` | h1 `About` | `経歴・スキル` |
| `src/app/about/page.tsx` | h2 `Introduction` | `自己紹介` |
| `src/app/about/page.tsx` | h2 `Career` | `経歴` |
| `src/app/about/page.tsx` | h2 `Skills` | `スキル` |
| `src/app/about/page.tsx` | h2 `Education` | `学歴・学術研究` |
| `src/app/about/page.tsx` | h2 `Personal` | `パーソナル` |
| `src/app/about/page.tsx` | h2 `Next read` | `次に読む` |
| `src/app/contact/page.tsx` | metadata.title + h1 `Contact` | `お問い合わせ` |
| `src/app/blog/page.tsx` | metadata.title + h1 `Blog` | `ブログ` |
| `src/app/projects/page.tsx` | h1 `Side Projects` | `サイドプロジェクト` |

**注意**: `metadata.title` は OS のタブ表示・ブックマーク・SEO に影響するため日本語化の効果が大きい。

### B. ホームに Personal プレビュー (資質タイプのみ)

新規コンポーネント: `src/components/home/PersonalInfoPreview.tsx`

**表示要素 (資質タイプのみ — ユーザー選択):**

1. 大見出し: `personalInfo.type` ("専門家 × エクスパンダー")
2. 補足文: `personalInfo.typeDescription`
3. 出典 caption: `source.name` + `source.url` (アッテルへの外部リンク)

**レイアウト**: 既存 `rounded-image bg-pure-white p-32 shadow-subtle-card` カードパターンを再利用。Sparkles などのアイコンを併用して視覚的に差別化。

**統合先**: `src/app/page.tsx` の Activity セクション後に追加 (条件付き: `author.personalInfo` 存在時のみ)

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

### C. 書籍年月 (アクション不要)

データ自体 (`blog.ts.publishedAt` および `activities.ts.date`) は既に正しい値 (SAA 2022-08 / Amplify 2023-09) に修正済み。LatestBlog の sort ロジック上、最新 3 ブログ記事 (2026 年公開) のみ表示されるため書籍は対象外。ユーザー了承済みのため変更しない。

---

## 段階分割

**1 ステップ実装** (中規模タスクの目安に準拠):

> 中（3〜5 ファイル、UI＋ロジック）→ 1〜2 ステップ
> — `/add-feature-planning` の指針より

実際は h1/h2 文字列置換と Personal プレビュー新規追加で **5 ファイル修正 + 1 ファイル新規 + 6 テストファイル更新/新規** に収まるため、1 PR / 1 ステップで完結。

---

## 重要な制約・リスク

| 項目 | 内容 | 対応方針 |
|---|---|---|
| StickyNav / 内部リンクの id 維持 | `#career`, `#skills`, `#education`, `#personal` の id は変更しない | h2 のテキストのみ変更し、`section[id]` は不変 |
| 既存テスト破壊 | 各ページテストが英語見出しを `getByRole('heading', { name: 'Career' })` で検証中 | 日本語見出しに合わせてアサーション一括更新 |
| `Featured Projects` aria-label の混在 | aria-label `Featured プロジェクト` は日本語と英語の混在 | h2 と aria-label の両方を `注目プロジェクト` で統一 |
| ホームの縦長化 | Activity の後にさらに Personal プレビューを追加 | 単一カードで縦幅小さく、影響軽微 |
| Tab title 影響範囲 | `metadata.title` 変更は SEO サイトマップ + ブックマークに反映 | 既存ユーザのブックマークは URL 不変のため影響なし |

---

## Critical Files

### 修正

- `src/app/page.tsx` — h2 5 箇所日本語化 + Personal プレビュー追加
- `src/app/about/page.tsx` — h1 + h2 7 箇所日本語化
- `src/app/contact/page.tsx` — metadata.title + h1 日本語化
- `src/app/blog/page.tsx` — metadata.title + h1 日本語化
- `src/app/projects/page.tsx` — h1 日本語化
- `__tests__/app/page.test.tsx` — h2 アサーション + Personal セクション検証
- `__tests__/app/about/page.test.tsx` — h1 + h2 アサーション
- `__tests__/app/contact/page.test.tsx` — h1 + metadata
- `__tests__/app/blog/page.test.tsx` — h1 + metadata
- `__tests__/app/projects/page.test.tsx` — h1

### 新規

- `src/components/home/PersonalInfoPreview.tsx`
- `__tests__/components/home/PersonalInfoPreview.test.tsx`

### 再利用 (変更なし)

- `src/components/home/SectionPreview.tsx` — タイトルラベルは props 経由で日本語可能
- `src/components/ui/AnimateOnScroll.tsx`
- `src/data/metadata.ts` — `personalInfo` の構造はそのまま
- `src/types/index.ts` の `PersonalInfo` / `PersonalInfoSource` 型

---

## Verification

### 自動ゲート (各ステップ完了時)

1. `npx vitest run` — 既存 282 件 + 新規 PersonalInfoPreview 数件 → 全 PASS
2. `npm run type-check` — clean
3. `npm run lint` — error 0 維持
4. `npm run format` — 必要なら自動修正
5. `npm run build` — 7 ルート全 Static 維持

### 手動確認

- ホーム: 「パーソナル」プレビューが Activity の後に表示され、資質タイプ + 説明 + アッテルリンクが見える
- ホーム: 全 h2 が日本語 (Career → 経歴 等)
- About: h1 が「経歴・スキル」、h2 が全て日本語
- Contact / Blog: ブラウザタブのタイトルが「お問い合わせ」「ブログ」
- Projects: h1 が「サイドプロジェクト」
- StickyNav の項目クリックで該当 h2 (id) にスクロール (id は変更しないため動作維持)

### ステアリング運用

- `.steering/[YYYYMMDD]-japanese-headings-and-personal-preview/` を作成
- requirements.md / design.md / tasklist.md の 3 点セットを生成

---

## 今回スコープ外 (将来検討)

- 用語ゆらぎの整理 (NAV「経歴・スキル」 vs StickyNav「キャリア」、`/activity` h1「活動履歴」 vs ホーム「活動履歴」 — 実は両方統一されるが、StickyNav が「キャリア」のままなど)
- SEO 強化 (OGP 画像生成、JSON-LD 構造化データ)
- Activity ページのカテゴリフィルター
- 書籍の Featured Projects 含有検討
- ダークモード時の視認性確認
- モバイル UX のレビュー
- Education ヒーロー画像の lightbox (拡大表示)

これらは別 PR / 別計画として扱う。
