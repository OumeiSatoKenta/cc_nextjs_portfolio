# 見出し日本語化 + ホーム Personal プレビュー — 設計

## アーキテクチャ概観

```
src/
├── app/
│   ├── page.tsx                     # h2 5 箇所 → 日本語 + PersonalInfoPreview 統合
│   ├── about/page.tsx               # h1 + h2 7 箇所 → 日本語
│   ├── contact/page.tsx             # metadata.title + h1 → お問い合わせ
│   ├── blog/page.tsx                # metadata.title + h1 → ブログ
│   └── projects/page.tsx            # h1 → サイドプロジェクト (metadata なし)
└── components/home/
    └── PersonalInfoPreview.tsx      # 新規: 資質タイプのみのプレビュー
```

## コンポーネント設計

### F4. `src/components/home/PersonalInfoPreview.tsx`

```tsx
import { Sparkles } from 'lucide-react';
import type { PersonalInfo } from '@/types';

interface PersonalInfoPreviewProps {
  info: PersonalInfo;
}

export function PersonalInfoPreview({ info }: PersonalInfoPreviewProps) {
  return (
    <article className="rounded-image bg-pure-white p-32 shadow-subtle-card">
      <div className="flex items-center gap-12">
        <Sparkles className="text-vercel-black" size={20} aria-hidden="true" />
        <h3 className="text-card-title text-vercel-black">{info.type}</h3>
      </div>
      <p className="mt-16 text-body-medium text-gray-600">{info.typeDescription}</p>
      {info.source && (
        <p className="mt-16 text-caption text-gray-500">
          出典:{' '}
          <a
            href={info.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-link-blue hover:underline"
          >
            {info.source.name}
          </a>
          {' '}による適性診断
        </p>
      )}
    </article>
  );
}
```

**設計判断**:

- `<article>` で囲み、見出し階層 (page h1 → section h2 → card h3) を保つ
- Sparkles アイコンを type に隣接配置することで視覚的アクセント
- `info.source` はオプショナル。`metadata.ts` では既に設定されているが防御的にチェック
- 余計な props (`limit` など) を取らず単一カード表示に専念 (PersonalInfo は 1 つしか持たない設計)

### F1-F3. ページ見出しの一括置換

各ページの修正は文字列置換のみで型変更なし。`siteMetadata` や `personalInfo` のデータ層は変更しない。

`metadata.title` の日本語化は layout.tsx の template `%s | サイト名` と組み合わさり、例えば Contact ページのタブには `お問い合わせ | Kenta Sato — Portfolio` と表示される (siteMetadata.name 依存)。

### F4 統合: `src/app/page.tsx`

既存パターン (Activity セクション) と全く同じ構造で SectionPreview ラップ:

```tsx
<AnimateOnScroll>
  <SectionPreview
    title="活動履歴"  // ← 日本語化
    ariaLabel="活動プレビュー"
    href="/activity/"
    linkLabel="すべての活動を見る"
  >
    <ActivityPreview activities={activities} />
  </SectionPreview>
</AnimateOnScroll>

{author.personalInfo && (
  <AnimateOnScroll>
    <SectionPreview
      title="パーソナル"
      ariaLabel="パーソナル情報"
      href="/about/#personal"
      linkLabel="詳細を見る"
    >
      <PersonalInfoPreview info={author.personalInfo} />
    </SectionPreview>
  </AnimateOnScroll>
)}
```

## 非機能設計

### NF1. 既存パターン準拠

- カードシャドウ・角丸・パディング・タイポグラフィは全て既存トークンを使用
- 余計な装飾は加えない (グラデーション等は使わない、PersonalInfo は本人情報なので落ち着いた表現)

### NF2. アクセシビリティ

- 出典リンクは `target="_blank"` + `rel="noopener noreferrer"` 必須
- `Sparkles` アイコンは `aria-hidden="true"` で読み上げ対象外
- StickyNav の id (`#intro`, `#career`, `#skills`, `#education`, `#personal`) は変更しない

### NF3. Static Export 互換

- `'use client'` 不要 (PersonalInfoPreview はサーバーコンポーネント)
- データはビルド時固定

## テスト設計

### 新規

#### `__tests__/components/home/PersonalInfoPreview.test.tsx`

検証項目:
1. `info.type` が h3 で表示される
2. `info.typeDescription` が描画される
3. `info.source` がある場合、外部リンクが `target="_blank"` + `rel="noopener noreferrer"` で表示される
4. `info.source` が undefined の場合、出典文が表示されない

### 更新

#### `__tests__/app/page.test.tsx`

- 既存 h2 アサーション (`Career`, `Skills` 等) → 日本語に書き換え
- Personal セクション (`'パーソナル情報'` aria-label region + `'パーソナル'` h2) の存在検証を新規追加

#### `__tests__/app/about/page.test.tsx`

- h1 / h2 全アサーションを日本語に書き換え

#### `__tests__/app/contact/page.test.tsx`

- h1 アサーションを `お問い合わせ` に
- (metadata.title はテスト対象外なら現状維持)

#### `__tests__/app/blog/page.test.tsx`

- h1 アサーションを `ブログ` に

#### `__tests__/app/projects/page.test.tsx`

- h1 アサーションを `サイドプロジェクト` に

## リスク評価

| リスク | 影響 | 対応 |
|---|---|---|
| StickyNav の id 整合性 | 高 | section の id (`#career` 等) は変更しない。h2 のテキストのみ変更 |
| 既存テストの破壊 | 中 | 各ページテストの英語アサーションを一括更新、見落としは vitest run で検出 |
| ホーム縦長化 | 低 | 単一カードで影響軽微 |
| Featured aria-label | 低 | h2 と aria-label を両方 `注目プロジェクト` で統一 |

## 完了条件

- 5 ファイル修正 + 1 component 新規 + 6 テストファイル更新/新規
- `npm run lint && npm run format && npm run type-check && npm run build && npx vitest run` 全 PASS
- 7 ルート全 Static 維持
- 手動確認: 全ページ日本語化 + ホーム「パーソナル」セクション
