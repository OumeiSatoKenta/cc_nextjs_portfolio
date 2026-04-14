# Requirements: Phase 3-C2 — Side Projects リネーム + プロジェクト追加 + メトリクス

## 背景

ポートフォリオ総合改善プラン Phase 3-C2。"Projects" を "Side Projects" にリブランドし、技術書・コミュニティ活動を含む幅広い個人活動を掲載する。インパクトメトリクス表示により成果を定量的に示す。

## 要件

### R1: ナビゲーション・ページタイトルのリネーム
- ナビラベル: `Projects` → `Side Projects`
- ページ h1: `Projects` → `Side Projects`
- ページサブタイトル: `公開プロジェクト一覧` → `個人開発・技術書・コミュニティ活動`
- HeroSection CTA: `Projects を見る` → `Side Projects を見る`

### R2: 型拡張
- `Project` 型に `metrics?: { label: string; value: string }[]` 追加
- `Project` 型に `linkLabel?: string` 追加

### R3: 新規プロジェクト3件追加
1. **AWS認定資格対策本 共著** — metrics: `[{label: '共著者数', value: '70'}, {label: 'ダウンロード数', value: '16,500'}]`
2. **AWS Amplify ハンズオン本 編集**
3. **JAWS / 生成AI 勉強会**
- コンテンツは `project_resume_facts.md` に基づく

### R4: 既存プロジェクトの拡張
- TiUG に `metrics` と `linkLabel: 'Connpass'` を追加

### R5: ProjectCard メトリクス表示
- メトリクス値: `text-sub-heading-large` トークン（32px, wt600）
- メトリクスラベル: `text-caption text-gray-400 font-medium`
- liveUrl リンクテキスト: ハードコード `Connpass` → `linkLabel ?? 'Live'`

### R6: テスト更新
- ProjectCard テストに metrics / linkLabel テストケース追加
- 既存テストが壊れないこと（optional props）
