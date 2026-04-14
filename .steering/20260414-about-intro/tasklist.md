# タスクリスト: About ページイントロ文追加 (C1)

## フェーズ1: 型とデータ

- [x] 1-1. `src/types/index.ts` の `SiteMetadata.author` に `introduction: string` を追加
- [x] 1-2. `src/data/metadata.ts` に `introduction` フィールドを追加

## フェーズ2: ページ

- [x] 2-1. `src/app/about/page.tsx` にイントロセクションを挿入

## フェーズ3: テスト

- [x] 3-1. `__tests__/app/about/page.test.tsx` にイントロ表示テストを追加

## フェーズ4: 検証

- [x] 4-1. テスト通過 (`npm run test`) — 131 passed
- [x] 4-2. 型チェック通過 (`npm run type-check`)
- [x] 4-3. Lint 通過 (`npm run lint`)
- [x] 4-4. ビルド通過 (`npm run build`)

## 実装後の振り返り

### 検証結果
- テスト: 131 passed (18 files) — 新規2テスト追加
- 型チェック: OK
- Lint: OK
- ビルド: OK

### 変更ファイル一覧
| ファイル | 変更内容 |
|---------|---------|
| `src/types/index.ts` | `SiteMetadata.author.introduction` 追加 |
| `src/data/metadata.ts` | introduction テキスト追加 |
| `src/app/about/page.tsx` | イントロセクション挿入 |
| `__tests__/app/about/page.test.tsx` | イントロ表示テスト2件追加 |

### デザイントークン活用 (U1)
- `text-sub-heading` (32px, wt400) を "Introduction" 見出しに使用 — 初の実使用箇所
