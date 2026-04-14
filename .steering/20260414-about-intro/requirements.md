# 要求定義: About ページイントロ文追加 (C1)

## 目的

About ページの冒頭に自己紹介文を追加し、訪問者が「この人は何をしている人か」を即座に理解できるようにする。

## 要求

### R1: 型拡張
`SiteMetadata.author` に `introduction: string` フィールドを追加。

### R2: データ追加
`siteMetadata.author.introduction` にレジュメ facts ベースの紹介文を設定。
会社名・具体的数値は含めない（CLAUDE.md ルール準拠）。

### R3: ページ表示
About ページのヘッダーと Career セクションの間にイントロセクションを挿入。
- 見出し: "Introduction" (`text-sub-heading` トークン: 32px, wt400)
- 本文: `text-body-large text-gray-600`
- `AnimateOnScroll` でフェードイン

### R4: テスト
About ページテストにイントロセクションの表示確認を追加。
