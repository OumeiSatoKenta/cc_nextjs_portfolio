# 設計: インタラクション統一 (U2)

## 方針

CSSクラスの置換のみで完結する変更。ロジック変更なし、新規ファイルなし。

## 変更マッピング

### ボタン（HeroSection.tsx）

| 要素 | 変更前 | 変更後 |
|------|--------|--------|
| Primary CTA | `transition-opacity hover:opacity-85` | `transition-all duration-200 hover:opacity-85 active:scale-[0.98]` |
| Secondary CTA | `transition-shadow hover:shadow-ring` | `transition-all duration-200 hover:shadow-ring active:scale-[0.98]` |

### カード（4コンポーネント共通パターン）

| 要素 | 変更前 | 変更後 |
|------|--------|--------|
| article | `transition hover:-translate-y-4 hover:shadow-full-card` | `transition-all duration-200 hover:-translate-y-4 hover:shadow-full-card` |

対象: `ProjectCard.tsx`, `BlogCard.tsx`, `StrengthCard.tsx`, `SocialLinkCard.tsx`

### アイコンボタン

| 要素 | ファイル | 変更前 | 変更後 |
|------|---------|--------|--------|
| SheetTrigger | Header.tsx | (transition なし) | `active:scale-95` 追加 |
| ソーシャルアイコン | Footer.tsx | `transition-colors hover:text-vercel-black` | `transition-all duration-200 hover:text-vercel-black active:scale-95` |

## 変更しないもの

- ナビリンク（Header/Footer）の `transition-colors` はそのまま維持
- hover エフェクトの内容自体は変更しない
- `transform-origin` のカスタマイズ不要（デフォルト center で適切）

## テスト影響

既存テストはクラス名を直接アサートしていないため、テストの修正は不要。
StrengthCard テストのみ `accent bar` 検証があるが、article の class 変更には影響しない。
