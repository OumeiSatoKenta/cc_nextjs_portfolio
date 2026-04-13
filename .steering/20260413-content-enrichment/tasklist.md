# タスクリスト

## 🚨 タスク完全完了の原則

**このファイルの全タスクが完了するまで作業を継続すること**

### 必須ルール
- **全てのタスクを`[x]`にすること**
- 「時間の都合により別タスクとして実施予定」は禁止
- 「実装が複雑すぎるため後回し」は禁止
- 未完了タスク（`[ ]`）を残したまま作業を終了しない

### タスクスキップが許可される唯一のケース
以下の技術的理由に該当する場合のみスキップ可能:
- 実装方針の変更により、機能自体が不要になった
- アーキテクチャ変更により、別の実装方法に置き換わった
- 依存関係の変更により、タスクが実行不可能になった

スキップ時は必ず理由を明記:
```markdown
- [x] ~~タスク名~~（実装方針変更により不要: 具体的な技術的理由）
```

---

## フェーズ1: 型定義の拡張

- [x] `src/types/index.ts` の `Skill` インターフェースに `years?: number` を追加
- [x] `src/types/index.ts` の `SiteMetadata.author` に `stats: { label: string; value: string }[]` を追加

## フェーズ2: データファイルの更新

- [x] `src/data/blog.ts` — 4 記事に description を追加
  - [x] DevContainer AWS チーム開発記事
  - [x] TiDB Cloud Zero 入門記事
  - [x] DevContainer Claude Code voice 記事
  - [x] ローカル環境 TiDB 記事
- [x] `src/data/social.ts` — LinkedIn エントリを追加
- [x] `src/data/skills.ts` — 全 20 スキルに years 値を追加（履歴書準拠）
- [x] `src/data/metadata.ts` — stats 配列を追加（3 項目）

## フェーズ3: コンポーネント実装

- [x] `src/components/icons/LinkedinIcon.tsx` を新規作成（GithubIcon パターン踏襲）
- [x] `src/components/icons/SocialIcon.tsx` に `linkedin` ケースを追加
- [x] `src/components/about/SkillGrid.tsx` に年数表示ロジックを追加
- [x] `__tests__/components/about/SkillGrid.test.tsx` の既存テストを years 付き表示に対応させる

## フェーズ4: 品質チェックと修正

- [x] すべてのテストが通ることを確認
  - [x] `npm test` — 15 files, 95 tests passed
- [x] リントエラーがないことを確認
  - [x] `npm run lint` — 0 errors, 3 warnings（既存の noArrayIndexKey、今回の変更と無関係）
- [x] 型エラーがないことを確認
  - [x] `npm run type-check` — 0 errors
- [x] ビルドが成功することを確認
  - [x] `npm run build` — 全7ページ Static Export 成功

## フェーズ5: ドキュメント更新

- [x] 実装後の振り返り（このファイルの下部に記録）

---

## 実装後の振り返り

### 実装完了日
2026-04-13

### 計画と実績の差分

**計画と異なった点**:
- ドキュメントレビューで `SkillGrid.test.tsx` の既存テストが years 付きテキストで壊れることが指摘され、フェーズ3にテスト修正タスクを追加した
- ドキュメントレビューで `design.md` にスキル years 値の一覧がないことが指摘され、履歴書から抽出した全20スキルの年数表を追記した
- LinkedIn エントリの `label` フィールドを構造レビュー・実装検証の推奨に従い削除（`platform` と同値で冗長）
- Biome のフォーマット規約により SkillGrid のテンプレートリテラルを 2 行に分割（`{skill.name}` と `{skill.years ? ...}` を別行に）

**新たに必要になったタスク**:
- `__tests__/components/about/SkillGrid.test.tsx` の既存テスト修正 — 年数表示の追加で `getByText('AWS')` が `getByText('AWS · 3y')` に変わるため
- `years` なしスキルのテストケース追加 — オプショナルフィールドの分岐カバレッジ確保

**技術的理由でスキップしたタスク**: なし（全タスク完了）

### 学んだこと

**技術的な学び**:
- Biome のフォーマッターは JSX 内のテンプレートリテラル連結を別行に強制する（行長制限）。実装前に `npm run lint` で確認すると手戻りが減る
- `SVGProps<SVGSVGElement>` パターンで SVG アイコンを作成すると lucide-react アイコンと同じ `iconMap` に型安全に共存できる
- Google Cloud の 0.5 年を `number` 型の 1 に切り上げる判断は design.md に明記しておくと、将来のデータ更新者への引き継ぎになる

**プロセス上の改善点**:
- ドキュメントレビュー（ステップ4.5）でテスト破壊の指摘を事前に受けたことで、実装時の手戻りをゼロにできた
- 4軸並列レビュー（構造・セキュリティ・実装検証・API準拠）により、異なる観点の指摘を漏れなく収集できた

### 次回への改善提案
- Phase 2 以降で UI 変更を伴う場合は、変更前の開発サーバースクリーンショットを取得しておくと差分確認が容易
- データファイル変更時は、該当データを参照する既存テスト一覧を Grep で事前に洗い出すタスクを計画段階で含める
- レビュー推奨事項のうちスコープ外の改善（beginner スタイル分離、SocialIcon テスト追加等）は別 issue として記録する
