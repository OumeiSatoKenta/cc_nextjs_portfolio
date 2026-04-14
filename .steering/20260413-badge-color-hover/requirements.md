# Requirements: カテゴリ別バッジカラー + カードホバーリフト

## 背景

Phase 1（データ充実）完了済み。SkillGrid にカテゴリ別の年数表示が入ったが、ユーザーから「色がわかりづらい」とフィードバックあり。現状、全バッジが同一の青色（badge-blue-bg/text）で統一されており、カテゴリの視覚的な区別がつかない。また、カードホバー時のインタラクションがシャドウ変化のみで、物理的な「持ち上がり」感がない。

## 要件

### R1: カテゴリ別バッジカラー（SkillGrid）

- SkillGrid のバッジ色をカテゴリ（cloud / language / database / tool）ごとに分ける
- expert レベル（黒背景 `bg-vercel-black text-pure-white`）は維持
- DESIGN.md のワークフローアクセントカラー（Develop Blue / Preview Pink / Ship Red）の淡い背景版をトークンとして定義
- カラートークンは `globals.css` の `@theme` に追加し、Tailwind ユーティリティとして使用可能にする

### R2: プラットフォーム別バッジカラー（BlogCard）

- BlogCard のプラットフォームバッジ（Zenn, Qiita, Amazon Kindle, note, Other）にプラットフォームごとの色を適用
- 新色（緑・オレンジ等）は DESIGN.md の「Don't introduce warm colors」に抵触するため、既存ワークフローカラーの淡い版を再利用する

### R3: カードホバーリフト

- 全カードコンポーネントに `hover:-translate-y-1` を追加し、浮き上がりのマイクロインタラクションを実現
- `transition-shadow` を `transition-all` に拡張して、translate と shadow の両方をアニメーションさせる
- 対象: `ProjectCard`, `BlogCard`, `SocialLinkCard`, `StrengthCard`

### R4: テスト更新

- SkillGrid テストのバッジクラスアサーションを新しいカテゴリカラーに更新
- BlogCard テストのプラットフォームバッジクラスアサーションを更新

## 対象外

- タグバッジ（BlogCard のタグ、ProjectCard のテクノロジータグ）の色変更は今回対象外（既存の badge-blue を維持）
- StrengthCard のアクセントバー色は変更しない（既に実装済み）
- アニメーション・スクロールトリガーは Phase 3 で対応

## 受け入れ条件

- [ ] SkillGrid でカテゴリごとに異なるバッジカラーが表示される
- [ ] expert レベルは黒バッジのまま
- [ ] BlogCard のプラットフォームバッジにプラットフォーム別の色が表示される
- [ ] 4つのカードコンポーネントがホバー時に浮き上がる
- [ ] `npm test` / `npm run lint` / `npm run typecheck` がすべてパス
- [ ] WCAG AA コントラスト比を満たす（バッジテキストと背景の比率 4.5:1 以上）
