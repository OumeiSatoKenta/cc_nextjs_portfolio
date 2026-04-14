# Frontend ナレッジ

セッション横断で蓄積する React / UI 関連の教訓とパターン集。

## レイヤー責務分離

### components/* から data/* を直接 import しない

**ルール**: 定数データ（`NAV_LINKS`, `socialLinks` など）はコンポーネントが直接 import するのではなく、`app/layout.tsx` など上位レイヤーが読み込み、props で注入する。

**根拠**: `docs/architecture.md` / `docs/repository-structure.md` のレイヤー境界ルール。data → components の直接依存はテスタビリティと再利用性を下げる。

**適用**: レイアウト系コンポーネント（Header/Footer/Navigation）はすべて props-driven にする。テスト側も props 経由でデータを差し替えやすい。

**初出**: `.steering/20260412-add-common-layout/`（共通レイアウト実装）

## React フック・パターン

### usePathname 依存 useEffect の初回マウントガード

**問題**: `usePathname` を依存配列に入れた `useEffect` は初回マウント時にも発火する。「ルート変更時に何かする」用途では、初回発火を抑止しないと意図しない副作用が出る（例: 開いたばかりのメニューが即座に閉じる）。

**解決**: `useRef` で前回値を保持し、変化があったときのみ副作用を実行する。

```ts
const previousPathname = useRef(pathname);
useEffect(() => {
  if (previousPathname.current === pathname) return;
  previousPathname.current = pathname;
  // ルート変更時のみ実行される処理
}, [pathname, /* ...その他の依存 */]);
```

**注意**: Strict Mode の二重マウントでも動作するよう、「現在の値と一致したら早期リターン」方式で書く（カウント方式は壊れる）。

**初出**: `.steering/20260412-add-common-layout/`（Navigation のルート変更時自動クローズ）

### body スクロールロックは Radix Dialog に委譲する

**現状**: shadcn/ui Sheet（Radix Dialog ベース）がスクロールロックを内蔵で処理するため、手動実装は不要。

**過去の手動パターン**（参考、現在は不使用）: effect で元の `overflow` 値を保存・復元する方式だったが、Radix 導入により削除済み。

**初出**: `.steering/20260412-add-common-layout/`（Navigation → Phase 5 で Sheet に置換）

## アクセシビリティ

### バッジカラーの WCAG AA コントラスト比を設計段階で検証する

**問題**: 淡い背景色 + 鮮やかなテキスト色の組み合わせは、見た目の印象ほどコントラスト比が高くない。ワークフローアクセントカラー（#0a72ef, #de1d8d）をそのまま淡い背景に載せると 4.5:1 未達になる。

**解決**: カラートークン設計時に WCAG AA 4.5:1 を事前検証し、必要に応じてテキスト色を暗い派生値に調整する。例: cloud #0a72ef→#0052cc（~6.6:1）、lang #de1d8d→#b31472（~5.2:1）、db #e04e43→#b83028（~5.4:1）。

**適用**: `@theme` にバッジカラートークンを追加する際は、必ず bg/text のペアでコントラスト比を確認してから design.md に記載する。

**初出**: `.steering/20260413-badge-color-hover/`（カテゴリバッジカラー）

### モーダル・ダイアログは shadcn/ui Sheet (Radix Dialog) を使う

**現状**: Phase 5 で手動モーダル（Navigation.tsx 134行）を shadcn/ui Sheet に置換。以下の機能が Radix Dialog に内蔵されており、手動実装が不要になった:

- フォーカストラップ（Tab / Shift-Tab ループ）
- スクロールロック
- Escape キーで閉じる
- オーバーレイクリックで閉じる
- `role="dialog"` + `aria-modal="true"`
- `inert` 属性による非表示時のAT完全ブロック

**注意**: SheetContent には `SheetTitle` と `SheetDescription` が必須（Radix 警告回避）。視覚的に不要な場合は `sr-only` クラスで非表示にする。

**初出**: `.steering/20260412-add-common-layout/`（Navigation → Phase 5 で Sheet に置換）

## ライブラリ・パッケージ

### lucide-react ブランドアイコンは SocialIcon 静的マッピングで解決する

**事情**: lucide-react v1.x は商標回避のため `github` / `twitter` / `linkedin` など主要ブランドアイコンを削除。`DynamicIcon` も使用不可（"Name not found" エラー）。

**解決**: `SocialIcon` コンポーネント（`src/components/icons/SocialIcon.tsx`）で静的マッピングを定義し、ブランドアイコンはカスタム SVG（`GithubIcon.tsx` 等）で提供する。

```tsx
// src/components/icons/SocialIcon.tsx
const iconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  github: GithubIcon,
  calendar: Calendar,
  mail: Mail,
};
```

**SVGアクセシビリティ**: カスタム SVG アイコンは `<title>` 要素で代替テキストを提供する（`aria-label` だと親要素の `aria-label` と競合する場合がある）。`SocialIcon` 側で `aria-hidden="true"` を付与し、リンクの `aria-label` に代替テキストを委譲。

**初出**: `.steering/20260412-add-common-layout/`（Phase 4 で DynamicIcon → SocialIcon に移行）

### Static Export 下の usePathname

**注意**: `output: 'export'` の Next.js App Router では `usePathname()` が null を返すケースがある。nullish フォールバックを必ず入れる。

```ts
const pathname = usePathname() ?? '/';
```

**初出**: `.steering/20260412-add-common-layout/`（useActiveNav）

## HTML セマンティクス

### `<time>` 要素には必ず `dateTime` 属性を付与する

**ルール**: `<time>` タグを使う場合、機械可読な日付値を `dateTime` 属性に設定する。テキスト内容が日本語表記（例: "2020年4月"）でも ISO 形式の `dateTime` が必要。

**根拠**: HTML仕様・WCAG準拠。スクリーンリーダーやクローラーが正しく日付を解釈できる。

**初出**: `.steering/20260413-add-about-page/`（TimelineItem, Education）

## Tailwind CSS パターン

### Tailwind v4: CSS-first config のトークン定義

**構造**: `tailwind.config.ts` は廃止。`globals.css` 内の `@theme { ... }` ブロックでデザイントークンを CSS 変数として定義する。

```css
@import "tailwindcss";
@theme {
  --color-vercel-black: #171717;
  --font-geist-sans: var(--font-geist-sans-face), Arial, sans-serif;
  --text-body: 1rem;
  --text-body--line-height: 1.625rem;
  --spacing: 1px;  /* p-8 = 8px, p-16 = 16px */
}
```

**フォント CSS 変数の命名**: `next/font/google` が生成する CSS 変数名と Tailwind `@theme` の変数名が衝突しないようにする。フォント側は `--font-geist-sans-face`、Tailwind テーマ側は `--font-geist-sans` と命名を分離する。

**spacing 基底値**: `--spacing: 1px` を設定することで、`p-8` が `8px`、`gap-16` が `16px` と 1:1 マッピングになる（DESIGN.md のピクセル値ベースのスペーシングスケールと整合）。

**PostCSS**: `@tailwindcss/postcss` プラグインを使用（`autoprefixer` は v4 内蔵のため不要）。

**Biome 互換**: `biome.json` に `"css": { "parser": { "tailwindDirectives": true } }` が必要。

**初出**: `.steering/20260413-portfolio-modernization/`（Phase 4）

### `--spacing: 1px` は translate-y にも影響する

**問題**: `@theme { --spacing: 1px; }` を設定すると、`p-*` / `gap-*` だけでなく `translate-y-*` 等の transform ユーティリティにも影響する。`hover:-translate-y-2` は 2px（デフォルトの 0.5rem ではない）となり、リフト量が不足する。

**解決**: 視認性のあるホバーリフトには `hover:-translate-y-4`（= 4px）を使用する。デザイン時に `--spacing` の影響を考慮し、実ピクセル値で検討すること。

**初出**: `.steering/20260413-badge-color-hover/`（カードホバーリフト）

### カードホバーには `transition`（`transition-all` ではない）を使う

**ルール**: Tailwind v4 の `transition` クラスは box-shadow, translate, transform 等のよく使うプロパティに限定されたキュレート済みセット。`transition-all` は全プロパティをアニメーション対象にするためパフォーマンスが劣る。

**適用**: `shadow-subtle-card` → `hover:shadow-full-card` + `hover:-translate-y-4` のようなカードホバーパターンでは `transition` で十分。

**初出**: `.steering/20260413-badge-color-hover/`（4 カードコンポーネント）

### 動的クラス名は静的マップで解決する

**問題**: Tailwind JIT はビルド時にクラスを抽出するため、テンプレートリテラルで動的に構築したクラス名（例: `` `bg-${color}` ``）は検出されない。

**解決**: `Record<UnionType, string>` 型の定数マップを定義し、値の参照で切り替える。

```ts
const CATEGORY_BADGE_CLASS: Record<SkillCategory, string> = {
  cloud: 'bg-badge-cloud-bg text-badge-cloud-text',
  language: 'bg-badge-lang-bg text-badge-lang-text',
  database: 'bg-badge-db-bg text-badge-db-text',
  tool: 'bg-badge-tool-bg text-badge-tool-text',
};
```

**初出**: `.steering/20260413-add-about-page/`（SkillGrid）、`.steering/20260412-add-home-page/`（StrengthCard）、`.steering/20260413-badge-color-hover/`（カテゴリバッジカラー）

### DESIGN.md の Badge/Caption には `font-medium` が必要

**ルール**: Pill Badge（`.rounded-pill`）や Caption テキストには `font-medium`（weight 500）を付与する。DESIGN.md の Typography 仕様で定められている。

**初出**: `.steering/20260413-add-about-page/`（TimelineItem badges, SkillGrid badges）

## テスト

### `getByText` は画面全体を検索する — 重複テキストに注意

**問題**: 同じ画面に同じ文字列が複数箇所に出現すると `getByText` が `Found multiple elements` で失敗する。例: "AWS" が Career の技術タグと SkillGrid の両方に出現。

**解決**: より具体的なクエリ（`getByRole('heading', { name })` やコンテナ内の `within()` スコープ）を使う。

**初出**: `.steering/20260413-add-about-page/`（page.test.tsx で skill names → category headings に変更）

### hover 状態のシャドウも DESIGN.md トークンを使う

**ルール**: `hover:shadow-md` や `hover:shadow-lg` のような Tailwind デフォルトのシャドウクラスを hover 状態に使わない。`hover:shadow-full-card` のように DESIGN.md で定義されたデザイントークンを使用する。

**根拠**: 静的状態では `shadow-subtle-card` 等の DESIGN.md トークンを使っていても、hover で Tailwind デフォルトに切り替えるとデザインシステムの一貫性が崩れる。

**初出**: `.steering/20260413-add-projects-page/`（ProjectCard）

### 外部リンクのセキュリティ属性はテストで全種別検証する

**ルール**: `target="_blank"` と `rel="noopener noreferrer"` のアサーションは GitHub リンクだけでなく Live リンク等すべての外部リンク種別で検証する。

**初出**: `.steering/20260413-add-projects-page/`（ProjectCard.test.tsx）

## パス比較

### prefix-only マッチの境界バグ

**問題**: `pathname.startsWith(href)` はそのままだと `/blog` が `/blogger` にもマッチしてしまう。

**解決**: 完全一致 or 直後にスラッシュを要求する形で比較する。

```ts
const isActive = (href: string): boolean => {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
};
```

**テスト**: `/blog` active のとき `/blogger` は非 active であることを必ず unit テストで担保する（回帰しやすい）。

**初出**: `.steering/20260412-add-common-layout/`（useActiveNav）
