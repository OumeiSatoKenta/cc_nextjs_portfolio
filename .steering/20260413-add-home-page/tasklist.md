# タスクリスト: トップページ（HeroSection・StrengthCard）

## Phase 1: データ更新

- [x] T1-1: `src/data/metadata.ts` の `author.tagline` を `"SRE Engineer — Multi-Cloud · IaC · AI-Driven Development"` に更新
- [x] T1-2: `src/data/metadata.ts` の `author.strengths[].description` を 3 件とも拡充（PII 非該当の技術特徴）

## Phase 2: StrengthCard 実装

- [x] T2-0: `src/types/index.ts` に `Strength` 型が定義され、`accentColor: 'ship' | 'preview' | 'develop'` が export されていることを確認（セッション内で確認済）
- [x] T2-1: `src/components/home/` ディレクトリを作成
- [x] T2-2: `src/components/home/StrengthCard.tsx` を実装（`ACCENT_BAR_CLASS` マップで静的クラス運用）
- [x] T2-3: `__tests__/components/home/StrengthCard.test.tsx` を作成（title / description / accentColor 3 種 / aria-hidden 検証）

## Phase 3: HeroSection 実装

- [x] T3-1: `src/components/home/HeroSection.tsx` を実装（`<h1>` + tagline + CTA `<Link href="/projects/">`）
- [x] T3-2: `__tests__/components/home/HeroSection.test.tsx` を作成（`<h1>` / tagline / CTA リンク先検証）

## Phase 4: トップページ統合

- [x] T4-1: `src/app/page.tsx` を書き換え（HeroSection + `<ul>` の 3 枚 StrengthCard）
- [x] T4-2: `__tests__/app/page.test.tsx` を作成（siteMetadata 連動、`<article>` 3 件検証）

## Phase 5: 品質検証

- [x] T5-1: `npm run lint` がエラーなく成功する
- [x] T5-2: `npm run type-check` がエラーなく成功する
- [x] T5-3: `npm test` が 全件 PASS する（既存テスト含む） — 35 / 35 passed
- [x] T5-4: `npm run build` が成功し `out/index.html` が生成される
- [x] ~~T5-5: `npm run dev` で `http://localhost:3000/` を開き、ヒーロー + 3 カードが表示されることを目視確認~~ (理由: ヘッドレス環境のため目視不可。`out/index.html` 内に "Projects を見る" CTA と 3 件の strength title が含まれることを grep で代替検証)

## Phase 6: レビュー

- [x] T6-1: `implementation-validator` サブエージェントで実装検証（CTA href 修正 [必須] 1 件指摘 → 反映済）
- [x] T6-2: 3 軸コードレビュー（structural / secondary-security / docs）を並列実行
- [x] T6-3: レビュー指摘を反映し、総合評価 B 以上・`[必須]` 0 件にする（構造 A− / 欠陥 B / API B、[必須] 0 件達成）

## Phase 7: 振り返り

- [x] T7-1: 本ファイルに「振り返り」セクションを追加
- [x] T7-2: 必要に応じて `docs/` 永続ドキュメントを更新（影響があれば） — functional-design.md の shadow 名称を統一
- [x] T7-3: `docs/functional-design.md` の "Card Stack shadow" 呼称を `shadow-subtle-card` トークンに統一する修正が必要か確認し、差分があれば更新（L388 / L458 に Tailwind トークン併記）

---

## 振り返り

**実装完了日**: 2026-04-13

### 計画と実績の差分

| 項目 | 計画 | 実績 | 備考 |
|---|---|---|---|
| タスク数 | 14 | 16（T2-0 / T7-3 追加） | ドキュメントレビュー指摘で 2 タスク追加 |
| テスト数 | 未定 | 35 件 全 PASS（新規 16 件） | HeroSection 4 / StrengthCard 7 / page 5 |
| lint / type-check / build | ✅ 想定 | 全 PASS | - |
| 3 軸レビュー総合評価 | B 以上 | 構造 A− / 欠陥 B / API B | [必須] 0 件達成 |
| CTA href 仕様 | `/projects/`（trailingSlash: true） | 同上（jsdom 正規化差分はテスト regex で吸収） | 本番ビルド出力は `/projects/` を維持 |

### 学んだこと

1. **Next.js `<Link>` + trailingSlash: true の jsdom 挙動差分**: 本番ビルドでは `/projects/` が正しく emit されるが、jsdom 環境では Next.js Link が末尾スラッシュを剥がす。テストは `toMatch(/^\/projects\/?$/)` のように regex で両形を許容するのが堅牢。
2. **Tailwind JIT と動的クラス生成**: `bg-${accentColor}` のような文字列補間は JIT が検出不可。`Record<AccentColor, string>` マップで完全文字列リテラルを列挙する設計が定番解。
3. **doc-reviewer → implementation-validator → 3 軸レビュー の多層フィードバック**: Step 4.5 のドキュメントレビューで 2 件 [必須] を事前解消、Step 6 で validator が実装の spec 逸脱を検出、Step 6.5 で 3 軸が並列実行することで、実装〜レビューの抜け漏れが最小化された。

### 次回への改善提案

1. **`max-w-[1200px]` を Tailwind トークン化**: Header / HeroSection / StrengthsSection で重複しているため、`tailwind.config.ts` の `maxWidth.site-max: '1200px'` として定義し、任意値を排除する（後続 PR 候補）。
2. **StrengthsSection コンポーネント分離**: 現状 `page.tsx` 内に `<ul>` + grid が直書きされているが、後続でセクションが増える際に `src/components/home/StrengthsSection.tsx` に切り出すと責務が明瞭になる。
3. **`metadata.ts` の `url` プレースホルダ運用**: `'https://example.com'` のまま。本番デプロイ前に `NEXT_PUBLIC_SITE_URL` 環境変数経由に置換する方針を F11（OGP 対応）で検討する。

### 申し送り事項（次タスク向け）

- **本人名の置換**: `siteMetadata.author.name` は `"Your Name"` のまま。ユーザーがローカルで実名に差し替える前提。コミット禁止（CLAUDE.md PII ルール）。
- **見出し階層**: 現状 `h1` → `h3`。強みセクションに `<h2 className="sr-only">強み</h2>` を追加する余地あり（WCAG 見出しジャンプ改善）。
- **T3-1 の `md:py-40` 削除**: 設計書と実装で `md:py-40` が重複していたため省略（py-40 で全解像度共通）。レスポンシブ要件を満たしている。

---

## レビュー・申し送り事項

- **Step 4.5 doc-reviewer**: `[必須]` 2 件 + `[高]` 3 件 → すべて反映済（scope-out 追記 / shadow 名称対応 / padding 768px 明示 / 64px → 80px トークン組合せ / T2-0 型確認）
- **Step 6 implementation-validator**: `[必須]` 1 件（CTA href spec 逸脱）→ ソース `/projects/` に戻し jsdom 差分はテスト regex で吸収
- **Step 6.5 3 軸レビュー**: `[必須]` 0 件。`[推奨]` 2 件反映（HeroSection `aria-label` / `querySelectorAll → getAllByRole`）、その他 `[推奨]` 4 件は後続 PR で対応
