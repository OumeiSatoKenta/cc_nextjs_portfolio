# 要求仕様: About ページ（経歴タイムライン・スキル一覧）

## 対象機能

PRD F2: 経歴・スキルページ（`/about`）

## ユーザーストーリー

採用担当者として、候補者の経験とスキルセットを時系列で確認するために、経歴タイムラインとスキル一覧が欲しい

## 受け入れ条件（PRD より）

- [ ] 経歴がタイムライン形式（Timeline コンポーネント）で表示される
- [ ] 各職歴に会社名・在籍期間・役割・主な成果が含まれる
- [ ] スキル一覧がカテゴリ別（言語、クラウド、DB、開発基盤等）で表示される
- [ ] 資格・学歴セクションがある

## スコープ

### IN

- `src/data/career.ts` — Career データ（5件、新しい順）
- `src/data/skills.ts` — Skill データ（4カテゴリ）
- `src/data/education.ts` — Education データ（学歴 + 資格）
- `src/types/index.ts` — Career / Skill / Education 型定義の追加
- `src/components/about/Timeline.tsx` — タイムラインコンテナ
- `src/components/about/TimelineItem.tsx` — 個別タイムライン項目
- `src/components/about/SkillGrid.tsx` — カテゴリ別スキルグリッド
- `src/app/about/page.tsx` — ページ統合（プレースホルダ→実装）
- テスト: 各コンポーネント + ページ統合

### OUT

- アニメーション（Post-MVP P1）
- スキルレベルのプログレスバー表示（Badge / Pill で代替）
- 個別職歴の詳細展開 UI

## データソース

- 職務経歴: auto-memory `project_resume_facts.md` の 5 件の職歴サマリ
- スキル一覧: 同メモリのスキル表（クラウド/IaC、言語、DB/キャッシュ、開発基盤の 4 カテゴリ）
- 学歴: 名古屋大学 大学院 博士課程後期 満期退学
- 資格: メモリに明示なし → 資格データは空配列で型だけ用意し、ユーザーが後で追加可能にする
- **PII ルール**: 社名・プロジェクト名・期間・技術スタック・主業務要約は公開 OK（メモリの公開可否に準拠）。生年・最寄駅は NG。具体数値（コスト削減率等）はメモリに記載のものをそのまま使用（職務経歴書に記載済みのため）

## 技術制約

- サーバーコンポーネント（`'use client'` 不要）
- Tailwind CSS トークンのみ（`tailwind.config.ts` 定義済み）
- DESIGN.md 準拠（shadow-as-border、Geist フォント、spacing 8px ベース）
- `named export` のみ（default export 禁止、ページコンポーネントを除く）
- 既存パターン踏襲（F1 HeroSection / StrengthCard の Props 分解渡し、aria-label 等）

## レスポンシブ要件

- モバイル（< 768px）: シングルカラム、`px-16`
- タブレット以上（≥ 768px）: `max-w-[1200px] mx-auto md:px-32`
- スキルグリッド: モバイル 1列 → md 2列 → lg 3列（StrengthCard と同パターン）
