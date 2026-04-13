# 設計書

## アーキテクチャ概要

本フェーズはデータレイヤー（`src/data/`, `src/types/`）とアイコンコンポーネントの変更のみ。アーキテクチャパターンの変更なし。

```
変更レイヤー:
  src/types/index.ts        <- 型拡張（Skill.years, author.stats）
  src/data/blog.ts          <- description 追加
  src/data/social.ts        <- LinkedIn エントリ追加
  src/data/skills.ts        <- years 値追加
  src/data/metadata.ts      <- stats 配列追加
  src/components/icons/SocialIcon.tsx  <- linkedin アイコン追加
  src/components/icons/LinkedinIcon.tsx <- 新規作成
  src/components/about/SkillGrid.tsx   <- 年数表示ロジック追加
```

## コンポーネント設計

### 1. LinkedinIcon（新規）

**責務**:
- LinkedIn ブランドマークの SVG を描画する

**実装の要点**:
- `GithubIcon.tsx` のパターンを踏襲（`ComponentType<SVGProps<SVGSVGElement>>`）
- `width`, `height`, `className` を props で受け取る
- `aria-hidden="true"` は呼び出し元の `SocialIcon` で付与済み
- LinkedIn 公式ブランドガイドの SVG パスを使用

### 2. SocialIcon（変更）

**責務**:
- アイコン名から対応する SVG コンポーネントを返す

**実装の要点**:
- `iconMap` に `linkedin: LinkedinIcon` を追加
- import 文を追加

### 3. SkillGrid（変更）

**責務**:
- スキルデータをカテゴリ別にグリッド表示する
- 各スキルバッジにスキル名と年数を表示する

**実装の要点**:
- `skill.years` が存在する場合のみ年数を表示
- テンプレートリテラル: `` `${skill.name}${skill.years ? ` · ${skill.years}y` : ''}` ``
- バッジの既存スタイル（サイズ・色・フォント）は変更しない
- テキストが長くなるが `flex-wrap` で折り返すためレイアウト崩れなし

## データフロー

### ブログ description 表示
```
1. src/data/blog.ts に description を追加（データ変更のみ）
2. BlogCard が既存の description プロップを受け取って表示（変更不要）
3. 表示の変化: カード内に description テキストが追加表示される
```

### LinkedIn リンク表示
```
1. src/data/social.ts に LinkedIn エントリ追加
2. Contact ページ（contact/page.tsx）が socialLinks を読み込み
3. SocialLinkCard が icon='linkedin' で SocialIcon を呼び出し
4. SocialIcon が iconMap['linkedin'] -> LinkedinIcon を返す
```

### スキル年数表示
```
1. src/types/index.ts に years フィールド追加
2. src/data/skills.ts に各スキルの years 値追加
3. About ページ（about/page.tsx）が skills を読み込み
4. SkillGrid が skill.years を読みバッジテキストに年数を追加表示
```

### ヒーロー統計データ
```
1. src/types/index.ts の SiteMetadata.author に stats 追加
2. src/data/metadata.ts に stats 配列を定義
3. 表示は Phase 4 で実装（本フェーズはデータ定義のみ）
```

## スキル years 値一覧（履歴書準拠）

auto-memory `project_resume_facts.md` から抽出。実装時はこの表を参照すること。

### Cloud / IaC
| スキル | years |
|--------|-------|
| AWS | 3 |
| Google Cloud | 1 |
| Terraform | 2 |
| Terragrunt | 1 |

### Languages
| スキル | years |
|--------|-------|
| Python | 4 |
| Shell Script | 7 |
| Perl | 3 |
| SQL | 4 |
| Ruby | 2 |

### Database
| スキル | years |
|--------|-------|
| Aurora MySQL | 3 |
| PostgreSQL | 2 |
| Redis / Valkey | 3 |
| TiDB | 1 |
| SQL Server | 1 |

### DevOps / Tools
| スキル | years |
|--------|-------|
| Docker | 4 |
| Git / GitHub | 7 |
| Jenkins | 2 |
| Claude Code (AI) | 1 |
| Nginx | 3 |
| Linux (CentOS/Ubuntu) | 7 |

> **注**: Google Cloud の履歴書上の年数は 0.5 年だが、`years` フィールドは `number` 型（整数）のため `1` に切り上げ

## エラーハンドリング戦略

本フェーズはデータ定義とUI表示のみのため、ランタイムエラーハンドリングは不要。型安全性でビルド時にエラーを検出する。

- `years` はオプショナル（`years?: number`）のため既存コードに影響なし
- `stats` はオプショナルにしない（Phase 4 で必ず使用するためデータの存在を型で保証）

## テスト戦略

### 既存テストの regression 確認
- `npm test` で全テスト通過を確認

### 新規テスト対象（既存テストファイルがある場合に追加）
- SkillGrid: 年数が表示されることのテスト（`skill.years` あり / なしの両方）
- SocialIcon: `linkedin` アイコンが返されることのテスト

## 依存ライブラリ

新しいライブラリの追加なし。

## ディレクトリ構造

```
src/
  components/
    icons/
      GithubIcon.tsx          (既存)
      LinkedinIcon.tsx         (新規)
      SocialIcon.tsx           (変更: linkedin ケース追加)
    about/
      SkillGrid.tsx            (変更: 年数表示追加)
  data/
    blog.ts                    (変更: description 追加)
    social.ts                  (変更: LinkedIn エントリ追加)
    skills.ts                  (変更: years 値追加)
    metadata.ts                (変更: stats 配列追加)
  types/
    index.ts                   (変更: Skill.years, author.stats 追加)
```

## 実装の順序

1. 型定義の拡張（`src/types/index.ts`）— 全ての変更の基盤
2. データファイルの更新（`blog.ts`, `social.ts`, `skills.ts`, `metadata.ts`）
3. LinkedinIcon コンポーネント作成
4. SocialIcon に linkedin ケース追加
5. SkillGrid に年数表示ロジック追加
6. テスト実行・修正

## セキュリティ考慮事項

- LinkedIn URL はハードコードされた外部リンク。`SocialLinkCard` の既存実装で `rel="noopener noreferrer"` が付与される

## パフォーマンス考慮事項

- バンドルサイズ増加: LinkedinIcon の SVG パス（< 1KB）のみ。無視できるレベル
- ランタイムコスト: なし

## 将来の拡張性

- `Skill.years` は Phase 2 のバッジカラー分岐で活用可能
- `author.stats` は Phase 4 のヒーロー統計カードで使用
- LinkedIn アイコンパターンは将来の SNS 追加でも再利用可能
