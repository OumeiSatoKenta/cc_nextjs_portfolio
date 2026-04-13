<!-- 生成日: 20260412 -->

# 開発ガイドライン (Development Guidelines)

## コーディング規約

### 命名規則

| 対象 | 規則 | 例 |
|------|------|------|
| 変数・関数 | camelCase | `getFormattedDate`, `isActive` |
| 定数 | UPPER_SNAKE_CASE | `SITE_URL`, `MAX_PROJECTS` |
| 型・インターフェース | PascalCase | `Project`, `BlogPost`, `SkillCategory` |
| Reactコンポーネント | PascalCase | `ProjectCard`, `HeroSection` |
| Props型 | PascalCase + `Props` | `ProjectCardProps`, `BadgeProps` |
| ファイル（コンポーネント） | PascalCase + `.tsx` | `ProjectCard.tsx` |
| ファイル（データ・ユーティリティ） | camelCase + `.ts` | `skills.ts`, `projects.ts` |
| ファイル（テスト） | 対象名 + `.test.tsx`/`.test.ts` | `Header.test.tsx` |
| CSSクラス | Tailwind CSS ユーティリティ | `text-gray-600`, `rounded-lg` |
| ディレクトリ | kebab-case | `about/`, `ui/`, `social-link/` |

### コードフォーマット

| 項目 | 設定 |
|------|------|
| インデント | 2スペース |
| セミコロン | あり |
| 引用符 | シングルクォート |
| 末尾カンマ | あり（ES5） |
| 行の最大長 | 100文字 |
| フォーマッター | Biome |

**Biome設定** (`biome.json`):
- セミコロン: あり
- 引用符: シングルクォート
- 末尾カンマ: あり（all）
- インデント幅: 2スペース
- 行幅: 100文字
- Tailwind v4ディレクティブ対応: `css.parser.tailwindDirectives: true`

### TypeScript規約

- **strict モード**: `tsconfig.json` で `strict: true` を有効化
- **any 禁止**: `any` 型の使用を禁止。`unknown` を使い、型ガードで絞り込む
- **型推論の活用**: 自明な型は明示しない（例: `const name = 'hello'` に `: string` は不要）
- **インターフェース vs 型エイリアス**: オブジェクトの形状定義には `interface` を使用。ユニオン型・タプル型には `type` を使用
- **非nullアサーション禁止**: `!` 演算子を使わず、適切なnullチェックを実装

### Reactコンポーネント規約

- **関数コンポーネント**: クラスコンポーネントは使用しない
- **Props定義**: コンポーネントと同ファイルにProps型を定義
- **default export禁止**: named exportのみ使用（import時の名前一致を強制）
- **コンポーネントサイズ**: 200行以下を推奨。超える場合はサブコンポーネントに分割
- **ロジックの分離**: 複雑なロジックはカスタムフックに切り出す

```typescript
// Good: named export + Props定義
interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div>
      <h3>{project.title}</h3>
    </div>
  );
}
```

### Tailwind CSS規約

- **DESIGN.md準拠**: カラー・フォントサイズ・スペーシングはDESIGN.mdのトークンに従う
- **カスタム値の制限**: `globals.css` の `@theme` ブロックで定義されたトークンのみ使用。`[#ff5b4f]` 等の任意値は原則禁止
- **クラス順序**: Biome の `useSortedClasses` ルールでクラス順序を自動整列
- **レスポンシブ**: モバイルファースト。`sm:`, `md:`, `lg:` の順にブレークポイントを適用

### コメント規約

- **不要なコメントを書かない**: コードで自明な内容にはコメントしない
- **Whyを書く**: 「なぜ」この実装を選んだかを書く。「何を」しているかはコードが語る
- **TODO**: `// TODO: [説明]` 形式。Issue番号があれば併記
- **JSDoc**: 公開APIやユーティリティ関数にのみ付与。コンポーネントのPropsは型定義で自明

### アクセシビリティ規約

- **セマンティックHTML**: 各ページに適切な見出し階層（`h1` は1ページ1つ、`h2` → `h3` の順序を守る）
- **ランドマーク要素**: `<header>`, `<nav>`, `<main>`, `<footer>` を適切に使用
- **画像の代替テキスト**: すべての `<img>` に意味のある `alt` 属性を付与。装飾画像は `alt=""` + `aria-hidden="true"`
- **フォーカス管理**: インタラクティブ要素にフォーカスリングを表示（`outline: 2px solid #0072f5`）。`outline: none` の単独使用は禁止
- **キーボード操作**: すべてのナビゲーション・リンク・ボタンがキーボードで操作可能
- **モバイルメニュー**: 開閉時にフォーカストラップを適用し、Escapeキーで閉じられること
- **カラーコントラスト**: WCAG 2.1 AA基準（通常テキスト 4.5:1、大テキスト 3:1）を満たす

### エラーハンドリング

- **静的サイト**: ランタイムエラーは最小限。ビルド時の型チェックとESLintで品質を担保
- **外部リンク**: `ExternalLink` コンポーネントで `rel="noopener noreferrer"` を強制
- **画像**: `alt` 属性を必ず指定。読み込み失敗時のフォールバック表示
- **404**: `app/not-found.tsx` でカスタム404ページを提供

## Git運用ルール

### ブランチ戦略

```
main ← 本番デプロイ対象（push時に自動デプロイ）
  │
  ├── feature/YYYYMMDD-feature-name ← 機能追加
  ├── fix/YYYYMMDD-fix-description  ← バグ修正
  └── chore/YYYYMMDD-task-name      ← 設定変更・ドキュメント
```

**ルール**:
- `main` への直接pushは禁止（PRマージのみ）
- ブランチ名に日付プレフィックスを付ける（例: `feature/20260415-add-hero-section`）
- マージ後のブランチは削除する

### コミットメッセージ規約

[Conventional Commits](https://www.conventionalcommits.org/) に準拠:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**type一覧**:

| type | 用途 | 例 |
|------|------|------|
| `feat` | 新機能追加 | `feat(home): add hero section` |
| `fix` | バグ修正 | `fix(nav): correct active page highlight` |
| `style` | スタイル変更（機能変更なし） | `style(card): adjust shadow opacity` |
| `refactor` | リファクタリング | `refactor(components): extract Badge component` |
| `docs` | ドキュメント | `docs: update architecture.md` |
| `test` | テスト追加・修正 | `test(ProjectCard): add render test` |
| `chore` | ビルド・設定変更 | `chore(deps): update next to 14.2` |

**scope**: 変更対象のコンポーネント名・ページ名・ディレクトリ名

**description**:
- 英語、小文字始まり
- 命令形（"add" not "added"）
- 50文字以内

### プルリクエスト

**PRテンプレート**:
```markdown
## Summary
- [変更内容の箇条書き]

## Test plan
- [ ] ビルド成功（`npm run build`）
- [ ] 型チェック通過（`npx tsc --noEmit`）
- [ ] ESLintエラーなし（`npm run lint`）
- [ ] 該当ページの表示確認
```

**PRルール**:
- 1PR = 1機能/1修正
- タイトルはConventional Commits形式
- セルフレビューを実施してからマージ
- `main` へのマージはSquash Mergeを推奨
  - **理由**: featureブランチの細かいコミット履歴（WIP、fix typo等）をmainに持ち込まず、1PR = 1コミットでgit logの可読性を維持するため
  - **例外**: 複数の独立した論理変更を含むPR（本来は分割すべきだが事情がある場合）では通常のMerge Commitを使用

## テスト戦略

### テストフレームワーク

| ツール | 用途 |
|--------|------|
| Vitest | テストランナー・アサーション（Jest互換API） |
| React Testing Library | コンポーネントテスト |
| Lighthouse CI | パフォーマンス・アクセシビリティ（デプロイ後計測） |

### テスト対象と優先度

> コンポーネント別のテスト要件の詳細は `docs/functional-design.md` のテスト戦略セクションを参照。

| 対象 | 優先度 | テスト内容 |
|------|--------|-----------|
| ExternalLink | 高 | `target="_blank"` と `rel="noopener noreferrer"` の付与 |
| Header | 高 | ナビゲーションリンクの存在、アクティブ状態 |
| Badge | 中 | ラベルテキストの表示、バリアントごとのスタイル |
| ProjectCard | 中 | 必須項目（タイトル・概要・技術タグ）の表示 |
| BlogCard | 中 | 外部リンクのセキュリティ属性 |
| Static Export | 高 | `out/` に全5ページが `*/index.html` 形式で出力されること（シェルスクリプトまたはJestテストで検証） |

### テスト命名規約

```typescript
describe('ComponentName', () => {
  it('should [期待される振る舞い] when [条件]', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

**例**:
```typescript
describe('ExternalLink', () => {
  it('should render with target="_blank" and rel="noopener noreferrer"', () => {
    render(<ExternalLink href="https://example.com">Link</ExternalLink>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
```

### テスト実行

```bash
# 全テスト実行
npm test

# 特定ファイルのテスト
npx vitest run --testPathPattern=Header

# カバレッジ付き
npm run test:coverage

# ウォッチモード（開発中）
npm run test:watch
```

### Static Exportの検証方法

ビルド後に `out/` ディレクトリの出力を検証する:

```bash
# ビルド実行
npm run build

# 全5ページの出力確認（CIスクリプトに組み込み可能）
test -f out/index.html && \
test -f out/about/index.html && \
test -f out/projects/index.html && \
test -f out/blog/index.html && \
test -f out/contact/index.html && \
echo "✅ All pages exported" || echo "❌ Missing pages"
```

## CI/CDパイプライン チェック順序

GitHub ActionsのCIジョブで実行するチェックの順序:

```
1. npm ci                    # 依存関係インストール
2. npm audit --audit-level=high  # 既知の脆弱性チェック（high以上で失敗）
3. npm run lint              # Biome check + ESLint（Next.js固有ルール）
4. npm run type-check        # TypeScript型チェック（tsc --noEmit）
5. npm test                  # Vitest テスト実行
6. npm run build             # Static Export ビルド
7. Static Export検証          # out/ に全ページが出力されていることを確認
```

**npm audit のタイミング**: CI/CDパイプラインの早期（ステップ2）で実行し、既知の脆弱性がある場合はビルドを中断する。`--audit-level=high` で high / critical のみを対象とし、low / moderate は警告に留める。

## コードレビュー基準

### レビュー観点

| 観点 | チェック内容 |
|------|-------------|
| 機能性 | PRDの受け入れ条件を満たしているか |
| 型安全性 | `any` を使っていないか。型定義は適切か |
| DESIGN.md準拠 | カラー・フォント・スペーシングがデザイントークンに従っているか |
| セキュリティ | 外部リンクに `rel="noopener noreferrer"` があるか |
| アクセシビリティ | セマンティックHTML、`alt` 属性、適切な見出し階層 |
| レスポンシブ | モバイル（375px）〜デスクトップ（1440px）で表示が崩れないか |
| パフォーマンス | 不要な依存追加がないか。バンドルサイズへの影響 |

### レビューコメントの書き方

| プレフィックス | 意味 | 対応 |
|--------------|------|------|
| `[must]` | 修正必須 | マージ前に対応 |
| `[should]` | 強く推奨 | 理由があればスキップ可 |
| `[nit]` | 些細な指摘 | 対応任意 |
| `[question]` | 質問 | 回答のみでOK |

## 開発環境セットアップ

### 必要ツール

| ツール | バージョン | 用途 |
|--------|-----------|------|
| Node.js | v24.11.0 | ランタイム |
| npm | 11.x | パッケージマネージャー |
| Git | 最新 | バージョン管理 |
| VS Code | 最新（推奨） | エディタ |

### セットアップ手順

```bash
# 1. リポジトリのクローン
git clone https://github.com/OumeiSatoKenta/cc_nextjs_portfolio.git
cd cc_nextjs_portfolio

# 2. devcontainerで開く（推奨）
# VS Codeで「Reopen in Container」を選択

# 3. 依存関係のインストール
npm ci

# 4. 開発サーバーの起動
npm run dev

# 5. ビルド確認
npm run build
```

### npm scripts

| コマンド | 用途 |
|---------|------|
| `npm run dev` | 開発サーバー起動（localhost:3000、`--webpack`フラグ付き） |
| `npm run build` | Static Exportビルド（`out/` 生成） |
| `npm run lint` | Biome check + ESLint実行 |
| `npm run type-check` | TypeScript型チェック（`tsc --noEmit`） |
| `npm test` | Vitestテスト実行 |
| `npm run test:watch` | Vitestウォッチモード |
| `npm run test:coverage` | Vitestカバレッジ付き実行 |
| `npm run format` | Biomeによるフォーマット |

### 推奨VS Code拡張機能

| 拡張機能 | 用途 |
|---------|------|
| Biome | リアルタイムlint・保存時フォーマット |
| ESLint | Next.js固有ルールの表示 |
| Tailwind CSS IntelliSense | Tailwindクラスの補完・プレビュー |
| TypeScript Importer | import文の自動補完 |

### 環境変数

MVPでは環境変数は不要。すべてのデータは `src/data/` 内のTypeScriptファイルで管理する。

将来的に外部サービス連携が必要になった場合は `.env.local` で管理し、`.gitignore` に含める。

## デザインシステムとの連携

### DESIGN.md → globals.css @theme の流れ

1. **DESIGN.md**: デザインの真実の源泉。カラー、タイポグラフィ、スペーシングを定義
2. **globals.css `@theme { ... }`**: DESIGN.mdのトークンをCSS変数として定義。Tailwind v4が自動的にユーティリティクラスを生成
3. **コンポーネント**: Tailwindのユーティリティクラスを通じてデザイントークンを適用

### デザイントークンの使用ルール

- DESIGN.mdに定義されたカラー・フォント・スペーシング値のみを使用する
- フレームワークのデフォルト値や独自の値を発明しない
- コンポーネントの状態（hover, focus, active等）はDESIGN.mdのパターンに従う
- shadow-as-border技法を使用し、CSS `border` は原則使わない

### Workflow Accent Colorsの用途

| アクセントカラー | 値 | 用途 |
|----------------|------|------|
| Develop Blue | `#0a72ef` | マルチクラウドの強み |
| Preview Pink | `#de1d8d` | AI駆動開発の強み |
| Ship Red | `#ff5b4f` | パフォーマンス改善の強み |

これらのカラーはStrengthCardのアクセントとしてのみ使用する。装飾目的での使用は禁止。
