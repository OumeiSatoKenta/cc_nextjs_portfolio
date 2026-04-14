# タスクリスト: インタラクション統一 (U2)

## フェーズ1: ボタン

- [x] 1-1. `HeroSection.tsx` の Primary CTA: `transition-opacity` → `transition-all duration-200` + `active:scale-[0.98]`
- [x] 1-2. `HeroSection.tsx` の Secondary CTA: `transition-shadow` → `transition-all duration-200` + `active:scale-[0.98]`

## フェーズ2: カード

- [x] 2-1. `ProjectCard.tsx`: `transition` → `transition-all duration-200`
- [x] 2-2. `BlogCard.tsx`: `transition` → `transition-all duration-200`
- [x] 2-3. `StrengthCard.tsx`: `transition` → `transition-all duration-200`
- [x] 2-4. `SocialLinkCard.tsx`: `transition` → `transition-all duration-200`

## フェーズ3: アイコンボタン

- [x] 3-1. `Header.tsx` の SheetTrigger: `active:scale-95` 追加
- [x] 3-2. `Footer.tsx` のソーシャルアイコン: `transition-colors` → `transition-all duration-200` + `active:scale-95`

## フェーズ4: 検証

- [x] 4-1. 既存テスト通過 (`npm run test`) — 129 passed
- [x] 4-2. 型チェック通過 (`npm run type-check`)
- [x] 4-3. Lint 通過 (`npm run lint`) — Biome `useSortedClasses` で `active:` の位置を自動修正
- [x] 4-4. ビルド通過 (`npm run build`)

## 実装後の振り返り

### 検証結果
- テスト: 129 passed (18 files) — テスト修正不要（クラス名を直接アサートするテストなし）
- 型チェック: OK
- Lint: OK（`useSortedClasses` nursery ルールが `active:` を `focus-visible:` の後に並べ替え）
- ビルド: OK（全7ページ static export）

### 実装サマリ
CSSクラスの文字列置換のみで完結。ロジック変更・新規ファイルなし。

| パターン | 適用箇所 | 変更内容 |
|---------|---------|---------|
| ボタン | HeroSection (2箇所) | `transition-all duration-200` + `active:scale-[0.98]` |
| カード | ProjectCard, BlogCard, StrengthCard, SocialLinkCard | `transition` → `transition-all duration-200` |
| アイコンボタン | Header SheetTrigger | `active:scale-95` 追加 |
| アイコンボタン | Footer ソーシャル | `transition-colors` → `transition-all duration-200` + `active:scale-95` |

### 教訓
- Biome の `useSortedClasses` (nursery) が `active:` pseudo-class の並び順を `focus-visible:` の後に要求する。新しいクラスを追加する際は `--unsafe` autofix で整列させると効率的。

### 変更ファイル一覧
| ファイル | 変更種別 |
|---------|---------|
| `src/components/home/HeroSection.tsx` | transition + active:scale 追加 |
| `src/components/projects/ProjectCard.tsx` | transition-all duration-200 |
| `src/components/blog/BlogCard.tsx` | transition-all duration-200 |
| `src/components/home/StrengthCard.tsx` | transition-all duration-200 |
| `src/components/contact/SocialLinkCard.tsx` | transition-all duration-200 |
| `src/components/layout/Header.tsx` | active:scale-95 追加 |
| `src/components/layout/Footer.tsx` | transition-all duration-200 + active:scale-95 |
