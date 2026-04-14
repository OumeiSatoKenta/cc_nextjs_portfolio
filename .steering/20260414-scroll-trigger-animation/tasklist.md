# Tasklist: スクロールトリガーアニメーション

## フェーズ 1: 基盤（フック + CSS + コンポーネント）

- [x] globals.css に @keyframes fade-in-up + .animate-fade-in-up + prefers-reduced-motion を追加
- [x] src/hooks/useInView.ts を新規作成
- [x] src/components/ui/AnimateOnScroll.tsx を新規作成

## フェーズ 2: ページへの適用

- [x] Home (page.tsx): HeroSection + StrengthCard グリッドにアニメーション適用
- [x] About (about/page.tsx): ページ見出し（h1 + 説明文）にアニメーション適用
- [x] About (about/page.tsx): Career / Skills / Education セクション見出し + 内容にアニメーション適用
- [x] Projects (projects/page.tsx): 見出し + カードグリッドにアニメーション適用
- [x] Blog (blog/page.tsx): 見出し + カードグリッドにアニメーション適用
- [x] Contact (contact/page.tsx): 見出し + カードグリッドにアニメーション適用

## フェーズ 3: テスト

- [x] __tests__/hooks/useInView.test.ts を新規作成（design.md D6 のモック戦略に従う）
- [x] __tests__/components/ui/AnimateOnScroll.test.tsx を新規作成（D6 の 3 ケースを全て網羅）
- [x] 既存ページテストが全パスすることを確認

## フェーズ 4: 検証

- [x] npm test でテスト全パス
- [x] npm run lint で lint エラーなし
- [x] npm run type-check で型エラーなし

---

## 実装後の振り返り

### 実装完了日
2026-04-14

### 計画と実績の差分

- **テストファイル拡張子**: 当初 `useInView.test.ts` で計画していたが、テスト内で JSX を使う `TestComponent` ヘルパーが必要になったため `.test.tsx` に変更。
- **グローバル IntersectionObserver モック**: 設計時点では個別テストファイル内のモックのみ想定していたが、全ページテスト（5ファイル30テスト）が `AnimateOnScroll` → `useInView` → `new IntersectionObserver()` の依存チェーンで失敗したため、`vitest.setup.ts` にグローバルな class ベースモックを追加。
- **vi.fn() の制約**: `vi.fn().mockImplementation(() => ...)` はアロー関数実装では `new` 演算子で呼べない（Vitest の仕様）。テスト内のモックは全て `class` ベースに統一して解決。

### 学んだこと

1. **jsdom + IntersectionObserver**: jsdom は IntersectionObserver を実装していないため、テストスイート全体に影響する。グローバルモックは `vitest.setup.ts` での class ベース実装が最も安定。
2. **Vitest の vi.fn() と new**: `vi.fn()` にアロー関数を渡した場合は constructor として使えない。class を使うか、`function` キーワードで書く必要がある。
3. **Tailwind v4 の CSS 構造**: `@theme` ブロックはデザイントークン専用。`@keyframes` やユーティリティクラスは `@theme` の外に記述する。
4. **renderHook の限界**: `renderHook` は DOM 要素を描画しないため、`useRef` で DOM ノードを参照するフックのテストには実際のコンポーネント描画（`render` + テスト用ラッパーコンポーネント）が必要。

### コードレビュー結果

- 実装検証: 5.0/5（必須指摘 0件）
- 3軸レビュー総合: B（必須指摘 0件）
- 共通の推奨事項: `options` 参照安定性（YAGNI 判断で現状維持）、`useRef<HTMLDivElement>` 型固定（将来の拡張時に対応）

### 次回への改善提案

1. **テスト計画時にグローバルモックの影響範囲を事前に洗い出す**: 新しい Web API を使うフックを導入する際は、既存テストへの影響を先に確認してからテスト作成に入る。
2. **`repository-structure.md` の更新**: `__tests__/hooks/` ディレクトリの追加を反映する（レビューで指摘あり）。
