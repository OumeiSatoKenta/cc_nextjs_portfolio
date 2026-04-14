# Tasklist: カテゴリ別バッジカラー + カードホバーリフト

## フェーズ 1: カラートークン追加

- [x] globals.css の @theme にカテゴリバッジカラートークン 8 個を追加

## フェーズ 2: SkillGrid カテゴリカラー

- [x] SkillGrid.tsx: LEVEL_BADGE_CLASS を削除し CATEGORY_BADGE_CLASS を定義
- [x] SkillGrid.tsx: バッジ className ロジックを expert 判定 + カテゴリマップに変更
- [x] SkillGrid.test.tsx: バッジクラスアサーションを新カテゴリカラーに更新

## フェーズ 3: BlogCard プラットフォームカラー

- [x] BlogCard.tsx: PLATFORM_BADGE_CLASS マップを追加しプラットフォームバッジに適用
- [x] BlogCard.test.tsx: プラットフォームバッジクラスアサーションを更新

## フェーズ 4: カードホバーリフト

- [x] ProjectCard.tsx: transition-all + hover:-translate-y-2 を追加
- [x] BlogCard.tsx: transition-all + hover:-translate-y-2 を追加
- [x] SocialLinkCard.tsx: transition-all + hover:-translate-y-2 を追加
- [x] StrengthCard.tsx: transition-all + hover:-translate-y-2 + hover:shadow-full-card を追加

## フェーズ 5: 検証

- [x] npm test でテスト全パス
- [x] npm run lint で lint エラーなし
- [x] npm run typecheck で型エラーなし

---

## 実装後の振り返り

### 実装完了日
2026-04-13

### 計画と実績の差分

| 項目 | 計画 | 実績 | 理由 |
|------|------|------|------|
| hover translate | `-translate-y-2` (2px) | `-translate-y-4` (4px) | `--spacing: 1px` のため 2px では視認困難。4px で適度なリフト感を実現 |
| transition クラス | `transition-all` | `transition` | Tailwind v4 の `transition` は curated set（box-shadow, translate, transform 等）に限定されパフォーマンスが良い。API/docs レビューで指摘 |
| バッジテキスト色 | ワークフローアクセント色をそのまま使用 | 暗い派生色に変更 | 初期値は WCAG AA 4.5:1 未達。cloud #0a72ef→#0052cc, lang #de1d8d→#b31472, db #e04e43→#b83028 に修正 |

### レビュー指摘と対応

- **[必須] コントラスト比**: cloud/lang/db の 3 カテゴリでテキスト色を暗くし AA 準拠を確保
- **[必須] transition-all → transition**: 全 4 カードコンポーネントで修正
- **[推奨] translate-y 値**: 2px → 4px に変更（`--spacing: 1px` の影響を考慮）
- **[情報] badge-blue と badge-cloud の値重複**: 既存トークンの整理は Phase 2 スコープ外として保留
- **[情報] BlogCard の無効日付ハンドリング、SocialLinkCard の target="_blank" 問題**: 既存の課題、Phase 2 スコープ外

### 学んだこと

1. **`--spacing: 1px` の影響範囲**: Tailwind v4 で `--spacing` をカスタムすると `translate-y-*` 等のユーティリティにも影響する。デザイン時に実ピクセル値を意識する必要がある
2. **WCAG AA コントラスト検証の重要性**: 淡い背景 + 鮮やかテキストの組み合わせは見た目の印象ほどコントラスト比が高くない。設計段階でツールによる検証を行うべき
3. **`transition` vs `transition-all`**: Tailwind v4 では `transition` が推奨。アニメーション対象プロパティを限定しパフォーマンスを最適化

### 次回への改善提案

1. **カラートークン設計時にコントラスト比を先行検証する**: design.md 作成段階で WCAG AA 準拠を確認し、レビューでの手戻りを削減
2. **`--spacing` カスタム値の影響一覧をドキュメント化する**: translate, gap, padding 等への影響を knowledge/frontend.md に記録
3. **badge-blue / badge-cloud の重複トークン整理**: 次回のデザイントークン見直し時に統合を検討
