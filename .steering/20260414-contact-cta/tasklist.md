# Tasklist: Contact ページ CTA 強化

## 実装タスク

- [x] 1. `src/app/contact/page.tsx` に CTA セクションを追加
- [x] 2. `__tests__/app/contact/page.test.tsx` に CTA 関連テストを追加
- [x] 3. lint / type-check / test 実行で全パス確認

## 振り返り

- **実装完了日**: 2026-04-14
- **計画と実績の差分**: 計画通り 2 ファイルの変更で完了。テスト修正で既存テスト 2 件のスコープ調整が必要だった（CTA リンクの追加によりリンク総数・target 属性テストの前提が変わったため）。
- **学んだこと**: `NodeListOf` を `for...of` で使う場合 `Array.from()` が必要（tsconfig の `target` が ES5 のため）。テストで `aria-label` によるセクションスコープ限定が CTA 追加時のテスト分離に有効。
- **次回への改善提案**: CTA ボタンスタイルは HeroSection と完全同一。将来 3 箇所以上で使われる場合は `components/ui/Button.tsx` への抽出を検討。現時点では 2 箇所のため不要。
