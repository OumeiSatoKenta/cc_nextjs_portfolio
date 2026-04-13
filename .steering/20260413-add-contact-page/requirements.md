# 要件: コンタクトページ（F5: /contact）

## ユーザーストーリー

採用担当者として、候補者に連絡を取るために、各種SNS・プラットフォームへのリンクが欲しい。

## 受け入れ条件

- GitHub / X(Twitter) / connpass 等のリンクがアイコン付きで表示される
- リンクは新しいタブで開く（mailto: を除く）
- メールアドレスへのリンク（`mailto:` 形式）がある

## データソース

- `src/data/social.ts` に既存の socialLinks データがある（GitHub / X / Mail の 3 件）
- connpass を追加する必要がある（TiUG 運営: https://tiug.connpass.com/）
- Footer でも同じ socialLinks を使用中

## 制約

- 既存の `SocialLink` 型を再利用する
- `socialLinks` データを拡充しつつ Footer との共存を維持する
- lucide-react の DynamicIcon を使用（ブランドアイコン欠落には string 型で対応済み）
- DESIGN.md のデザイントークンのみ使用
