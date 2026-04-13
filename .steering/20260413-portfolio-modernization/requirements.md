# 要件: ポートフォリオ モダナイゼーション

## 背景
先輩エンジニア Kazu さん（面接官経験あり）から docs/ideas/senpai-comment.md でフィードバックを受けた。面接で「なぜこの技術選定？」と聞かれても答えられるスタックに刷新し、フロントエンド理解をアピールする。

## フェーズ
1. Jest → Vitest（リスク: 低、独立実行可）
2. ESLint+Prettier → Biome（リスク: 低〜中、独立実行可）
3. Next.js 14 → 15 → 16（リスク: 中、Phase 1+2 マージ後）
4. Tailwind CSS v3 → v4（リスク: 高、Phase 3 後）
5. shadcn/ui 導入（リスク: 中、Phase 4 後）

## 制約
- 各フェーズを独立したブランチ/PR として出荷
- Static Export（`output: 'export'`）を維持すること
- 各フェーズ完了時に全14テストが Pass すること
- DESIGN.md のセマンティックトークンを保持すること
- ビジュアルリグレッションなし
