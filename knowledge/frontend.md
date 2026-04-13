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

### body スクロールロックは元の値を保存・復元する

**問題**: `document.body.style.overflow = 'hidden'` をクリーンアップで空文字に戻すと、ユーザーや別コンポーネントが設定していた `overflow` 値（例: `'scroll'`）を消してしまう。

**解決**: effect 起動時に元の値を保存し、クリーンアップで復元する。

```ts
useEffect(() => {
  if (!isOpen) return;
  const previous = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  return () => {
    document.body.style.overflow = previous;
  };
}, [isOpen]);
```

**初出**: `.steering/20260412-add-common-layout/`（Navigation のスクロールロック）

## アクセシビリティ

### モーダル非表示時は inert 属性で完全ブロックする

**問題**: `aria-hidden` + `pointer-events-none` + `opacity-0` だけでは、補助技術（AT）やブラウザの一部から閉じたモーダル内要素にフォーカスが届く可能性がある。

**解決**: React 19 / Next.js では HTML 標準の `inert` 属性を使う。

```tsx
<div
  aria-hidden={!isOpen}
  inert={!isOpen}
  className={isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}
>
  {/* ダイアログ内容 */}
</div>
```

**利点**: アンマウント戦略（条件分岐で `{isOpen && <Dialog />}`）と異なり、開閉トランジションを維持したまま AT からの完全ブロックが実現できる。

**初出**: `.steering/20260412-add-common-layout/`（Navigation モバイルメニュー）

### フォーカストラップの標準実装

モーダル系では以下をセットで実装する:

1. 開いた瞬間にクローズボタン（または最初のフォーカス可能要素）へ `.focus()`
2. Tab / Shift-Tab で最後⇔最初をループさせる
3. Escape キーで閉じる
4. 閉じた後は呼び出し元のフォーカス元に戻す（未実装なら将来の課題として記録）
5. `role="dialog"` + `aria-modal="true"` + `aria-label`

**初出**: `.steering/20260412-add-common-layout/`（Navigation）

## ライブラリ・パッケージ

### lucide-react ブランドアイコンの欠落と型戦略

**事情**: lucide-react は商標回避のため `github` / `twitter` / `linkedin` など主要ブランドアイコンを削除している（`x` / `mail` など汎用アイコンは残存）。

**対処**: `SocialLink.icon` のような外部ブランドを受けるフィールドを `IconName` に tighten すると既存データが破綻する。型は `string` のまま保ち、描画境界で `as IconName` キャスト + 意図コメントを残すのが現実解。

```ts
// src/types/index.ts
export interface SocialLink {
  platform: string;
  url: string;
  icon: string; // lucide brand icon 欠落対応のため string のまま
}

// src/components/layout/Footer.tsx
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
// ...
<DynamicIcon name={link.icon as IconName} size={20} />
```

**将来対応**: ブランドアイコンが必要なら `simple-icons` などブランド特化のアイコンライブラリ併用を検討する。

**初出**: `.steering/20260412-add-common-layout/`

### Static Export 下の usePathname

**注意**: `output: 'export'` の Next.js App Router では `usePathname()` が null を返すケースがある。nullish フォールバックを必ず入れる。

```ts
const pathname = usePathname() ?? '/';
```

**初出**: `.steering/20260412-add-common-layout/`（useActiveNav）

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
