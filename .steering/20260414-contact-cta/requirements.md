# Requirements: Contact ページ CTA 強化

## 概要

Contact ページのヘッダーとソーシャルリンク一覧の間に、CTA（Call To Action）セクションを挿入する。訪問者がアクションを起こしやすいよう、メール送信と LinkedIn への導線を目立つ形で配置する。

## 機能要件

### FR-1: CTA カード表示
- ページヘッダーセクションとリンク一覧セクションの間に新しい CTA セクションを追加
- `rounded-image` (12px) のカード内に以下を配置:
  - 見出し: 「お気軽にご連絡ください」（`text-sub-heading-large` トークン使用）
  - 説明文: SRE・クラウド・AI 関連の相談、コミュニティコラボ等について記述
  - Primary CTA: メール送信ボタン（`bg-vercel-black` スタイル）
  - Secondary CTA: LinkedIn リンク
  - 補足テキスト（`text-button-small text-gray-400`）

### FR-2: メール送信ボタン
- `mailto:` リンクとして機能
- メールアドレスは `src/data/social.ts` の既存データから取得
- DESIGN.md の Primary Dark ボタンスタイル + U2 インタラクションパターン

### FR-3: LinkedIn リンク
- LinkedIn プロフィール URL は `src/data/social.ts` の既存データから取得
- セカンダリボタンスタイル（ghost / shadow-bordered）+ U2 インタラクションパターン
- 外部リンクのため `target="_blank" rel="noopener noreferrer"`

### FR-4: 補足テキスト
- CTA ボタン下部に控えめなテキスト
- `text-button-small text-gray-400` トークン使用

## データソース

- メールアドレス: `src/data/social.ts` の `Mail` エントリ
- LinkedIn URL: `src/data/social.ts` の `LinkedIn` エントリ
