# Tasklist: Phase 3-C2 — Side Projects

## 実装タスク

- [x] T1: `src/types/index.ts` — Project 型に `metrics` / `linkLabel` 追加
- [x] T2: `src/data/navigation.ts` — `Projects` → `Side Projects`
- [x] T3: `src/data/projects.ts` — 新規3件追加 + TiUG に metrics/linkLabel
- [x] T4: `src/components/projects/ProjectCard.tsx` — metrics / linkLabel 表示対応
- [x] T5: `src/app/projects/page.tsx` — タイトル変更 + 新props渡し
- [x] T6: `src/components/home/HeroSection.tsx` — CTA テキスト変更
- [x] T7: `__tests__/components/projects/ProjectCard.test.tsx` — テスト更新

## フォローアップ（ユーザーリクエスト）

- [x] T8: カード高さ揃え — ProjectCard / BlogCard に `h-full` 追加
- [x] T9: About 自己紹介を PDF 職務要約 3 段落に更新
- [x] T10: 学歴エントリに修士・博士の研究内容 description 追加
- [x] T11: ICRC2019 Proceedings（筆頭著者）を Education に追加、`Education` 型に `'publication'` 追加
- [x] T12: Education カードにタイプバッジ（学歴/論文）と日付ラベル（修了/発表）追加
- [x] T13: 論文の発表年を 2019 に修正（PoS 掲載 2021 は description に補足）

## 検証

- [x] V1: `npm run type-check` — パス
- [x] V2: `npm run lint` — パス（既存 warnings のみ）
- [x] V3: `npm run test` — 134/134 パス
- [x] V4: `npm run build` — Static Export 成功

## レビュー

### 変更サマリ
- **型拡張**: `Project` に `metrics` / `linkLabel` 追加（optional → 破壊的変更なし）
- **ナビ/ページ**: Projects → Side Projects リブランド（nav, h1, subtitle, Hero CTA）
- **データ**: 3件の新プロジェクト追加（AWS資格本/Amplifyハンズオン本/JAWS勉強会）+ TiUG にメトリクス/linkLabel
- **ProjectCard**: メトリクス表示（`dl`/`dd`/`dt` セマンティクス）+ linkLabel 対応
- **テスト**: 3テストファイルのテキスト更新 + 4新テストケース追加（linkLabel default/custom, metrics表示/非表示）

### 追加で更新したテストファイル
- `__tests__/app/page.test.tsx` — CTA テキスト更新
- `__tests__/components/home/HeroSection.test.tsx` — CTA テキスト更新
- `__tests__/app/projects/page.test.tsx` — h1 / subtitle テキスト更新
