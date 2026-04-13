# タスクリスト: CI/CD デプロイパイプライン

## フェーズ1: ワークフローファイル作成（前提: なし）

- [x] 1-1. `.github/workflows/` ディレクトリ作成
- [x] 1-2. `.github/workflows/ci.yml` 作成（PR 品質ゲート: lint / type-check / test / audit / build / 5 ページ出力検証, concurrency あり）
- [x] 1-3. `.github/workflows/deploy.yml` 作成（main push: 品質ゲート + OIDC + s3 sync + CloudFront invalidation, concurrency あり, secrets/vars 参照）

## フェーズ2: ドキュメント整備（前提: なし / フェーズ1と並行可能）

- [x] 2-1. `docs/SETUP.md` に「GitHub Secrets / Variables 登録手順」セクションを追加（Secrets 3 個・Variables 1 個・取得方法・登録方法）
- [x] 2-2. `docs/SETUP.md` に「インフラ側の前提条件」セクションを追加（`cc_aws_portfolio` の `terraform.tfvars` の `github_repo` 修正が必要である旨を明記）
- [x] 2-3. `docs/repository-structure.md` に `.github/workflows/` のディレクトリ説明を追加

## フェーズ3: ローカル検証（前提: フェーズ1完了）

- [x] 3-1. YAML シンタックスの妥当性確認（`js-yaml` で parse OK、`jobs`/`steps` 構造を確認）
- [x] 3-2. `npm run lint` / `npm run type-check` / `npm test` / `npm run build` / `npm audit --audit-level=critical` が全て成功、5 ページ出力検証もパス

## フェーズ4: レビュー対応（前提: フェーズ1-3完了）

- [x] 4-1. 3 軸コードレビュー（structural / secondary / docs）を並列実行し、[必須] / 評価 B 以上になるまで対応
  - 初回結果: structural=B / secondary=C / docs=B
  - [必須] 2 件対応:
    - `deploy.yml` に `if: github.ref == 'refs/heads/main'` を追加（workflow_dispatch の非 main 誤操作防止）
    - Secrets（`S3_BUCKET_NAME` / `CLOUDFRONT_DISTRIBUTION_ID`）を `env:` 経由で環境変数化し、シェルインジェクション耐性を確保
  - [推奨] 主要対応:
    - `actions/checkout@v4` に `persist-credentials: false` を設定（GITHUB_TOKEN 漏洩面の縮小）
    - `actions/setup-node@v4` → `@v6` に更新（最新メジャー版）
    - `concurrency.group` を `${{ github.workflow }}-...` 形式に統一
    - 静的出力検証に `out/_next/` と `out/404.html` の存在確認を追加
    - design.md の `--audit-level=high` を実装に合わせて `critical` に修正
  - 再検証: YAML パース OK（ci.yml 9 steps / deploy.yml 12 steps）、`out/_next` と `out/404.html` 存在確認済み

## フェーズ5: 振り返り（前提: フェーズ4完了）

- [x] 5-1. `tasklist.md` にレビューセクションを追記（下記 §振り返り 参照）
- [x] 5-2. `knowledge/cicd.md` を新規作成し、今回得た CI/CD パターンを反映
- [x] 5-3. `docs/repository-structure.md` は既にフェーズ2で更新済み。`docs/architecture.md` は §ビルドパイプライン の内容と実装が一致しており追加更新不要

---

## 振り返り

### 実装完了日

2026-04-13

### 成果物

| 種別 | パス | 内容 |
|------|------|------|
| 新規 | `.github/workflows/ci.yml` | PR 品質ゲート（lint/type-check/test/audit/build/5 ページ出力検証） |
| 新規 | `.github/workflows/deploy.yml` | main push デプロイ（品質ゲート + OIDC + S3 sync + CF invalidation） |
| 更新 | `docs/SETUP.md` | §7「CI/CD パイプラインの初期設定」を追加（Secrets 3 個 + Variables 1 個 の登録手順、インフラ側前提条件） |
| 更新 | `docs/repository-structure.md` | `.github/workflows/` のディレクトリ説明を追加 |
| 新規 | `knowledge/cicd.md` | 今回得た CI/CD パターン（OIDC / concurrency / shell injection 対策 等）をセッション横断知識として記録 |

### 検証結果

| コマンド | 結果 |
|----------|------|
| YAML パース（`js-yaml`） | ci.yml 9 steps / deploy.yml 12 steps とも OK |
| `npm run lint` | PASS（ESLint 警告・エラーなし） |
| `npm run type-check` | PASS |
| `npm test` | PASS（3 suites / 19 tests） |
| `npm audit --audit-level=critical` | exit 0（high 4 件は Static Export 攻撃面ゼロとして ACK 済み） |
| `npm run build` | PASS（8 静的ページ出力） |
| 5 ページ出力検証 | `out/{index,about/index,projects/index,blog/index,contact/index}.html` 存在確認済み |
| 追加検証（`out/_next/` / `out/404.html`） | 両方存在を確認 |

### 計画と実績の差分

1. **`--audit-level` の設計値**: 当初 `high` 固定の方針だったが、Next.js 14 の既知 high CVE 4 件（DoS 系）が Static Export 構成では攻撃面ゼロであるため `critical` に緩和。requirements.md に根拠を追記し、design.md も実装に合わせて更新した。
2. **Post-MVP 想定だった `concurrency` を MVP に前倒し**: `aws s3 sync --delete` の並行実行時の race condition リスクを doc-reviewer が指摘したため、`deploy-production` グループ（`cancel-in-progress: false`）を初期から導入した。
3. **Secrets と Variables の分離**: 当初「Secrets に全て登録」の雑な設計だったが、doc-reviewer 指摘で `AWS_REGION` のみ Variables に移動。ログマスクによるデバッグ困難性を回避。
4. **シェルインジェクション対策**: 初期実装は `s3://${{ secrets.S3_BUCKET_NAME }}/` を直接シェル行に展開していた。code-reviewer-secondary + Codex MCP の指摘で、`env:` 経由で環境変数化する方式に変更。
5. **`workflow_dispatch` の非 main 制限**: UI 上で任意ブランチを選択実行できてしまう仕様ギャップがあり、`if: github.ref == 'refs/heads/main'` をジョブに追加。
6. **`actions/setup-node@v4` → `@v6`**: code-reviewer-docs が Context7 で最新仕様を確認した結果、最新メジャーが v6 と判明したため更新。
7. **出力検証の強化**: 初期は 5 ページ HTML のみだったが、`_next/` と `404.html` の存在確認を追加（`trailingSlash` 設定変更等の暗黙ドリフト検出用）。

### 学んだこと

1. **CI/CD は「動けば OK」ではなく、ドキュメントレビュー + 3 軸コードレビュー + セカンドオピニオン（Codex MCP）を通すことで重大な仕様ギャップ（`workflow_dispatch` の ref 問題、シェルインジェクション耐性）が洗い出される**。特にセキュリティ観点は自己分析では見落としがちで、独立したレビュー観点が不可欠。
2. **`${{ secrets.* }}` を run ブロックに直接展開するのはアンチパターン**。必ず `env:` 経由で環境変数化し、シェル変数として `"${VAR}"` で渡すことで GitHub Actions 式展開とシェル展開を分離する。
3. **`npm audit --audit-level` の値は「理想論」ではなく「実攻撃面」で決める**。Next.js Static Export 構成のように「サーバーランタイムを持たない」ことが確定しているなら、`high` の DoS 系 CVE は無視できる。ただし将来のアーキテクチャ変更（ISR や Server Components 有効化）で再評価が必要で、その旨を requirements.md に明記することで技術的負債を可視化できる。
4. **`concurrency` は `cancel-in-progress` の真偽でトリガー性質に応じて正反対に設定する**。PR は `true`（古いランを捨てる方が早い）、production deploy は `false`（先行実行を待たないと `--delete` と競合）。
5. **`workflow_dispatch` は便利な半面、UI から任意ブランチ選択できてしまう**。本番デプロイ系のワークフローには `if: github.ref == 'refs/heads/main'` 等のブランチ制限を忘れずに付ける。
6. **`persist-credentials: false` は `contents: read` でも付けるべき**。`npm ci` / `postinstall` 等のリポジトリ由来の任意コード実行が発生するステップが後続にあるため、`GITHUB_TOKEN` を Git 設定に持ち回さない方が攻撃面が小さい。

### 次回への改善提案

1. **`actions/*` のコミット SHA pinning**: 現在は `@v4` / `@v5` / `@v6` の mutable tag 参照。サプライチェーン攻撃対策として Post-MVP で SHA に固定化する（特に `aws-actions/configure-aws-credentials`）。
2. **Lighthouse CI の導入**: PRD の非機能要件「Performance/Accessibility スコア 90 以上」を CI で強制するため、`ci.yml` に `treosh/lighthouse-ci-action` 等を追加する。
3. **Reusable Workflow で品質ゲートを共通化**: 現状は `ci.yml` と `deploy.yml` で品質ゲートが重複している。Post-MVP で `.github/workflows/_quality-gate.yml` に切り出し、両ワークフローから `workflow_call` で呼ぶ。
4. **`aws s3 sync` の非アトミック性対応**: 現状はデプロイ中の一時的不整合を許容しているが、Post-MVP で「プレフィックス切り替え方式」やバージョン付きパスへの移行を検討する。
5. **`deploy.yml` の成功 / 失敗通知**: 個人運用では不要だが、将来コラボレーター追加時には GitHub Environment の protection rules（required reviewers）を設定する。
6. **cc_aws_portfolio 側の `terraform.tfvars` 修正（`github_repo = "cc_nextjs_portfolio"`）がインフラ側の責務である点をユーザーに確実に伝達する**。本リポジトリでは `docs/SETUP.md` §7-1 に明記済みだが、初回デプロイ時に必ず確認する運用ルールが必要。
