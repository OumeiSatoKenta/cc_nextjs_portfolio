# 設計: コンタクトページ（F5: /contact）

## コンポーネント設計

### SocialLinkCard

**パス**: `src/components/contact/SocialLinkCard.tsx`

**責務**: SNS・プラットフォームリンクのカード表示

**Props**: flat props パターン（F1〜F4 と統一）

```typescript
interface SocialLinkCardProps {
  platform: string;
  url: string;
  icon: string;
  label?: string;
}
```

**構造**:
- ルート: `<article>` （ProjectCard / BlogCard と統一パターン）
- アイコン: `DynamicIcon`（lucide-react/dynamic）— size 32
- プラットフォーム名: Body Medium（16px/500）
- 下部リンク: `「{label ?? platform} →」` テキストリンク

**リンク判定**:
- `http://` / `https://` → `target="_blank"` + `rel="noopener noreferrer"`
- `mailto:` → target/rel なし（メールクライアントを起動）
- Footer.tsx の `isExternalHttpUrl` と同じロジック

**スタイル**:
- カードシャドウ: `shadow-subtle-card` / `hover:shadow-full-card`
- 角丸: `rounded-comfortable`
- パディング: `p-32`
- ギャップ: `gap-16`
- アイコン色: `text-gray-600`

### ページ

**パス**: `src/app/contact/page.tsx`

**レイアウト**:
- h1: "Contact" (`text-display-hero`)
- 副題: "各種SNS・プラットフォーム" (`text-body-large text-gray-600`)
- グリッド: `grid gap-32 md:grid-cols-2`（4 カード → 2x2）
- metadata export 付き

**データ注入**:
- `src/data/social.ts` の `socialLinks` を直接 import（page.tsx はページレイヤーであり architecture.md の依存ルール上、データレイヤーからの import は許可範囲）

**Props 設計の根拠**:
- flat props パターンを採用（F1〜F4 の ProjectCard / BlogCard と統一）
- functional-design.md の `link: SocialLink` 仕様は実装済みコンポーネント群の実態に合わせて更新する

## データ更新

### social.ts

connpass を追加（4 件に拡充）:

```typescript
{
  platform: 'connpass',
  url: 'https://tiug.connpass.com/',
  icon: 'calendar',
  label: 'connpass',
}
```

icon は `calendar`（connpass = イベントプラットフォーム → カレンダーアイコンが適切）

## テスト設計

### SocialLinkCard.test.tsx

- プラットフォーム名の表示
- アイコンの描画
- 外部リンクのセキュリティ属性（target/rel）
- mailto リンクに target/rel が付かないこと
- label が指定された場合の表示

### page.test.tsx

- h1 の表示
- 副題の表示
- 全 socialLinks がカードとして表示される
- リンク数の確認
