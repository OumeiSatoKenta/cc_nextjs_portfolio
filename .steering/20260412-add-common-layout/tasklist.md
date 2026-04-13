# タスクリスト: 共通レイアウト（Header・Footer・Navigation）

## フェーズ1: プロジェクト初期化

- [x] 1-1. package.json作成と依存パッケージインストール（Next.js 14, React 18, TypeScript 5, Tailwind CSS 3, lucide-react, ESLint, Prettier, Jest, RTL）
- [x] 1-2. TypeScript設定（tsconfig.json: strict mode, paths alias `@/*`）
- [x] 1-3. Next.js設定（next.config.js: output export, trailingSlash, images unoptimized）
- [x] 1-4. Tailwind CSS設定（tailwind.config.ts: DESIGN.mdトークン全反映 + postcss.config.js）
- [x] 1-5. ESLint + Prettier設定（.eslintrc.json, .prettierrc, prettier-plugin-tailwindcss）
- [x] 1-6. Jest + React Testing Library設定（jest.config.ts, jest.setup.ts）
- [x] 1-7. グローバルCSS作成（src/app/globals.css: Tailwindディレクティブ）
- [x] 1-8. .gitignore作成

## フェーズ2: 型定義・データファイル

- [x] 2-1. 共有型定義（src/types/index.ts: SiteMetadata, Strength, SocialLink, navLinks定数型）
- [x] 2-2. サイトメタデータ（src/data/metadata.ts: プレースホルダーデータ）
- [x] 2-3. SNSリンクデータ（src/data/social.ts: プレースホルダーデータ）

## フェーズ3: ルートレイアウト・ページスタブ

- [x] 3-1. ルートレイアウト（src/app/layout.tsx: Geistフォント, メタデータ, Header+main+Footer構成）
- [x] 3-2. ページスタブ作成（page.tsx × 5 + not-found.tsx: 最小実装）

## フェーズ4: レイアウトコンポーネント実装

- [x] 4-1. Headerコンポーネント（src/components/layout/Header.tsx: sticky, ナビリンク, アクティブ状態, ハンバーガー）
- [x] 4-2. Navigationコンポーネント（src/components/layout/Navigation.tsx: モバイルスライドイン, オーバーレイ, フォーカストラップ, 4つの閉じる条件）
- [x] 4-3. Footerコンポーネント（src/components/layout/Footer.tsx: コピーライト, SNSアイコンリンク, lucide-react DynamicIcon）

## フェーズ5: テスト

- [x] 5-1. Headerテスト（__tests__/components/layout/Header.test.tsx: ナビリンク存在, アクティブ状態）
- [x] 5-2. Footerテスト（__tests__/components/layout/Footer.test.tsx: コピーライト, SNSリンク属性）
- [x] 5-3. Navigationテスト（__tests__/components/layout/Navigation.test.tsx: isOpen/onClose, Escapeキー, オーバーレイクリック）

## フェーズ6: ビルド検証

- [x] 6-1. npm run build成功確認 + 全ページがout/に出力されることを検証

---

## レビューセクション

### 実装完了日

2026-04-12

### 実装成果物

- `src/components/layout/Header.tsx` — sticky ヘッダ、デスクトップナビ + ハンバーガー、props-driven
- `src/components/layout/Navigation.tsx` — モバイルスライドイン、フォーカストラップ、4閉じ条件 + ルート変更自動クローズ、`inert` 属性
- `src/components/layout/Footer.tsx` — コピーライト、SNSアイコン、mailto/外部 URL 判定
- `src/hooks/useActiveNav.ts` — パス境界バグフリーな `isActive` 共通化
- `src/data/navigation.ts` — `NAV_LINKS` を data 層へ分離
- `src/types/index.ts` — 共有型定義整備
- `src/app/layout.tsx` / `src/app/not-found.tsx` — data を props として注入、`metadataBase` 設定
- `__tests__/components/layout/*.test.tsx` × 3 — 計 19 ケース

### 検証結果

| 項目 | 結果 |
|---|---|
| `npm test` | 19/19 passed |
| `npm run lint` | clean |
| `npm run type-check` | clean |
| `npm run build` | 8 ルート全 static 生成成功 |
| 動作確認 | dev server で `/`, `/about/`, `/contact/` が HTTP 200 応答 |

### 計画と実績の差分

| 観点 | 差分 |
|---|---|
| コンポーネント粒度 | 計画通り 3 コンポーネント。追加で `useActiveNav` カスタムフックを抽出（初回実装では Header/Navigation に `isActive` ロジックを重複させていた）。 |
| データ層設計 | 計画では `types/index.ts` に `NAV_LINKS` を定数として同居させていたが、レビューで「型定義と実データを混在させない」「components から data を直接 import しない」というアーキテクチャルール（`docs/architecture.md` / `docs/repository-structure.md`）違反を指摘され、`src/data/navigation.ts` に移動のうえ `app/layout.tsx` から props で注入する形に改修。 |
| アクセシビリティ | 計画では Escape + オーバーレイ + 閉じるボタン + リンククリックの 4 閉じ条件のみ。レビューで「ルート遷移時にメニューが開いたままになる」「閉じた状態でも DOM 内要素にフォーカスが届き得る」を指摘され、ルート変更自動クローズ（初回マウントガード付き ref パターン）と `inert` 属性を追加。 |
| テストカバレッジ | 計画の 12 ケースから 19 ケースに拡充。特に Navigation のライフサイクル系（body overflow の保存・復元、ルート変更でのクローズ、prefix-only 境界）を追加。 |
| 型定義 | 計画では `SocialLink.icon` を `string` 型のまま。実装途中で `lucide-react/dynamic` の `IconName` へ tighten を試みたが、lucide-react が github/twitter の商標ブランドアイコンを削除済みであるため data 側で解決できず、string 型に戻して Footer の描画境界で `as IconName` キャストし、コメントで意図を明記。 |

### 学んだこと

- **レイヤー責務分離の徹底**: `types/` に定数を混ぜると「型定義と実データ」の二重責務になり、後で data レイヤを分離するときに破壊的変更になる。最初から `types/` は純粋な型だけ、`data/` は値だけに分けるのが安全。
- **`useEffect` + pathname 依存の落とし穴**: `usePathname` 依存の effect は初回マウント時にも発火するため、ルート変更検知には `useRef` で前回値を保持するガードが必須。依存配列だけでは「変化した」判定はできない。
- **`inert` 属性の費用対効果**: `aria-hidden` + `pointer-events-none` + `opacity-0` では補助技術（AT）からのフォーカス到達を完全にブロックできない。React 19 / Next.js 環境では `inert={!isOpen}` を dialog wrapper に付けるだけで解決し、アンマウント戦略より圧倒的にシンプル。
- **lucide-react のブランドアイコン事情**: 商標回避のため lucide-react から `github` / `twitter` / `linkedin` が削除された。型を `IconName` に tighten するとブランドアイコンを持つ既存データが破綻するので、SocialLink など外部ブランドを扱う型は `string` のまま保ち、描画境界でキャスト + コメントで意図を残すのが現実解。
- **静的エクスポート + `usePathname`**: Static Export 環境下では `usePathname()` が null を返すケースがあるため、`?? '/'` のフォールバックが必要。

### 次回への改善提案

1. **アーキテクチャルールのチェックリスト化**: `components/* は data/* を直接 import しない` のような横断ルールは、PR テンプレートや `development-guidelines.md` の冒頭チェックリストに再掲する。レビューで指摘されてからの手戻りコストが大きい。
2. **ナレッジへの反映**: `knowledge/frontend.md` に以下のパターンを追記する:
   - `usePathname` 依存 useEffect の初回マウントスキップ（ref ガード）
   - `inert` 属性によるモーダル非表示時のフォーカス制御
   - lucide-react ブランドアイコン欠落時の型戦略
3. **テスト観点**: 今回追加した「body.style.overflow の元の値を保存・復元」「prefix-only 境界」「ルート変更クローズ」は、今後モーダル系コンポーネントを追加するときの標準テスト観点として流用可能。テンプレート化を検討。
4. **[推奨] 残タスク（将来的対応）**: Footer の URL スキーム検証（`javascript:` / `data:` 弾き）は、SocialLink を CMS / 外部 API から注入するタイミングで必ず実装する。現状は静的データのため実害ゼロで見送り。
5. **[提案] 残タスク（将来的対応）**: オーバーレイカラー `bg-[rgba(0,0,0,0.4)]` を `tailwind.config.ts` の `colors.overlay` トークンに昇格し、DESIGN.md 準拠の一元管理にする。

