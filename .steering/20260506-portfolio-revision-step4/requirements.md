# Step 4: 詳細メタデータ + スキルアイコン — 要件定義

## 目的

面接官・採用担当者が知りたい「チーム規模・役割種別・スキルの自信度」を可視化する。データ層の型を拡張し、既存コンポーネント（ProjectCard / TimelineItem / SkillGrid）を強化することで、表層 UI の追加なしに情報密度を上げる。

参照: `docs/ideas/portfolio-revision-plan.md` (Step 4 範囲のみ)

## 前提

- Step 1-3 完了済み（ナビ日本語化、Hub 化、About 強化）。
- 既存テスト 220 件 PASS。
- 既存 lucide-react ライブラリの利用実績あり（ProjectThumbnail.tsx）。

## 機能要件

### F1. Project 型拡張 + ProjectCard メタデータ表示

- `Project` に以下のオプショナルフィールド追加:
  - `teamSize?: number` — プロジェクト関与人数
  - `role?: string` — 担当役割（例: "個人開発", "編集", "運営メンバー"）
  - `userCount?: string` — ユーザー数 / ダウンロード数等（例: "16,500 ダウンロード"）
- `ProjectCard` 内に「メタデータピル」セクションを追加:
  - 配置: highlights の後、metrics の前（または technologies の上）
  - 表示形式: `アイコン + ラベル + 値` を rounded-pill バッジで横並び
  - 例: `[Users] チーム: 70人 · [User] 役割: 執筆・進捗管理 · [TrendingUp] 16,500 DL`
- いずれかのフィールドが欠けていても残りだけ表示。全て無ければセクション自体非表示。

### F2. Career 型拡張 + TimelineItem バッジ表示

- `Career` に以下のオプショナルフィールド追加:
  - `teamSize?: number` — チーム規模
  - `roleType?: RoleType[]` — 役割種別（複数指定可）
- `RoleType = 'design' | 'implementation' | 'management' | 'operations'`
- `TimelineItem` で:
  - 既存の `<time>` の下に「チーム規模バッジ」(`Users` アイコン + "チーム X 人")
  - 役割種別をカラーバッジ列で表示（既存の technologies バッジと同様の rounded-pill）
  - 役割ラベル: `design → '設計'`, `implementation → '実装'`, `management → 'マネジメント'`, `operations → '運用'`
  - カラー: 既存トークン (`badge-cloud`, `badge-lang`, `badge-db`, `badge-tool`) を割り当て

### F3. Skill 型拡張 + SkillGrid アイコン + 得意/成長中ラベル分け

- `Skill` に `icon?: string` 追加（lucide-react のアイコン名）。
- `SkillGrid` を再構成:
  - **トップレベル 2 グループ**: `得意領域` (`expert` + `advanced`) / `成長中` (`intermediate` + `beginner` + `level` 未設定)
  - **各グループ内**でカテゴリ別 (Cloud / IaC, Languages, Database, DevOps / Tools) にスキルを並べる
  - スキルチップに lucide-react アイコンを左側に表示（icon フィールドが設定されている場合）
  - icon が未設定なら従来通りテキストのみ
  - `description` が設定されているスキルにはチップ下に補助テキストを表示
- 分類ルール: `level === 'expert' || level === 'advanced'` → 「得意領域」。それ以外（`intermediate` / `beginner` / `undefined`）→ 「成長中」。`level` 未設定の場合「成長中」グループに分類することで、新規スキル追加時のデフォルト動作を予測可能にする。

### F4. データ更新

- `src/data/projects.ts`: 全 6 プロジェクトに `teamSize` / `role` / `userCount` を可能な範囲で追加
- `src/data/career.ts`: 全 5 キャリアエントリに `teamSize` / `roleType` を可能な範囲で追加
- `src/data/skills.ts`: 全 19 スキルに `icon` を割り当て

## 非機能要件

### NF1. 既存パターン準拠

- バッジ: `rounded-pill bg-badge-*-bg text-badge-*-text px-10 py-3 text-caption`
- アイコンサイズ: lucide-react の `size={14}` または `size={16}`、`aria-hidden="true"` 必須
- カード: 既存 `ProjectCard` / `TimelineItem` のパディング・gap を維持

### NF2. アクセシビリティ

- アイコンは装飾なので `aria-hidden="true"`、テキストラベルで意味を伝える
- バッジは `<span>` で OK（独立リンク・ボタンではない）
- カラーのみで意味を伝えない（色 + テキストラベル併記）

### NF3. ダークモード

- 既存トークン使用で自動対応

### NF4. テスト

- 既存テスト 3 件（ProjectCard / TimelineItem / SkillGrid）を更新
- 後方互換: メタデータ無しのケースも引き続き動作することを検証

## スコープ外

- 活動履歴ページ新設（Step 5）
- 写真サイズ統一（Step 5）
- タイピングアニメーション（Step 5）

## 完了条件

- 型 3 つ（Project / Career / Skill）拡張完了
- データ 3 ファイル（projects / career / skills）更新完了
- コンポーネント 3 つ（ProjectCard / TimelineItem / SkillGrid）強化完了
- 既存テスト 3 件更新 + 新規アサーション追加
- `npm run lint && npm run format && npm run type-check && npm run build && npx vitest run` 全 PASS
