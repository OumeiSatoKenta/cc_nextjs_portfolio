# cc_nextjs_portfolio

Next.js 16 + Tailwind CSS v4 で構築した個人ポートフォリオサイトです。

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript 5.x |
| スタイリング | Tailwind CSS v4 |
| テスト | Vitest + Testing Library |
| リンター / フォーマッター | Biome + ESLint |
| CI | GitHub Actions |
| デプロイ | Static Export → S3 + CloudFront |

インフラ（Terraform）は別リポジトリ `cc_aws_portfolio` で管理しています。

## 開発環境

devcontainer で開発環境を構築しています。VS Code の Remote - Containers または GitHub Codespaces で起動してください。

## コマンド一覧

```bash
npm run dev          # 開発サーバー起動
npm run build        # 本番ビルド（Static Export）
npm run lint         # Biome + ESLint によるリント
npm run format       # Biome による自動フォーマット
npm run type-check   # TypeScript 型チェック
npm test             # Vitest テスト実行
npm run test:watch   # テスト ウォッチモード
npm run test:coverage # カバレッジ付きテスト実行
```

## ライセンス

`.claude/skills/` 内のスキルの一部は [Apache License 2.0](.claude/skills/APACHE-2.0-LICENSE) の下でライセンスされています。
