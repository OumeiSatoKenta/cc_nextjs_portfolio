# Design: Phase 5 テスト更新

## テストカバレッジ現状

| コンポーネント | テスト | 状態 |
|---|---|---|
| ThemeToggle | `__tests__/components/ui/ThemeToggle.test.tsx` | 8テスト、十分 |
| ThemeProvider | なし | next-themes ラッパーのみ、テスト不要 |
| ProjectCard | `__tests__/components/projects/ProjectCard.test.tsx` | 15テスト、Phase 3/4 で追加済み |
| ProjectThumbnail | なし | **独立テスト必要** |

## 新規テスト: ProjectThumbnail

`__tests__/components/projects/ProjectThumbnail.test.tsx`

### テストケース

1. **accentColor ごとのグラデーションクラス**: ship → `from-ship-red/20`, preview → `from-preview-pink/20`, develop → `from-develop-blue/20`
2. **アイコンレンダリング**: 有効なアイコン名で SVG が存在
3. **不明アイコン**: `return null` で何もレンダリングしない
4. **image 指定時**: `<img>` 要素がレンダリングされ、アイコンは表示されない
5. **fit=contain**: `object-contain` クラスが付与
6. **fit=cover (default)**: `object-cover` + `object-top` クラスが付与
7. **aria-hidden**: 装飾要素に `aria-hidden="true"` が付与

### テスト方針

- `@testing-library/react` の `render` + `container.querySelector` でクラス検証
- next/image は jsdom 環境で `<img>` としてレンダリングされるため特別な mock 不要
