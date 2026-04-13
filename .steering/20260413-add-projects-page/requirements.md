# 要件: Projects ページ（プロジェクト一覧カード）

## スコープ

F3: `/projects` ページに ProjectCard コンポーネントを使ったプロジェクト一覧を実装する。

## 受け入れ基準

1. `/projects` に h1 "Projects" + サブタイトル + ProjectCard グリッドが表示される
2. ProjectCard は以下を表示: プロジェクト名・概要・技術タグ（Pill Badge）・GitHub リンク・ハイライト（任意）
3. `src/data/projects.ts` にプロジェクトデータを定義（履歴書 + 公開リポジトリから）
4. `src/types/index.ts` に Project 型を追加
5. レスポンシブ: モバイル 1 列 / md 以上 2 列グリッド
6. DESIGN.md のカードスタイル準拠（shadow-subtle-card, rounded-comfortable）
7. 全テストが PASS、lint・type-check・build がエラーなし

## データソース

- 履歴書メモリ (`project_resume_facts.md`) のプロジェクト情報
- 公開 GitHub リポジトリ（cc_nextjs_portfolio, cc_aws_portfolio）
- functional-design.md の Project エンティティ定義

## PII ルール

- 業務委託先の実名会社名・サービス名は伏せる（About ページと同じ方針）
- 公開リポジトリのプロジェクトは実名 OK
