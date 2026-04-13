# コンテンツ & UX エンリッチメント計画

## 背景

技術スタックのモダナイゼーション（Phase 1〜5）が完了済み。ポートフォリオは Next.js 16 + Tailwind v4 + shadcn/ui + Vitest + Biome で稼働中。次のステップとして**コンテンツの深化**と**UI/UXのリッチ化**を行う。

### 現状分析

- **ヒーロー**: テキストのみ（名前 + タグライン + CTA 1つ）。グラデーション・統計・視覚的インパクトなし
- **カード**: フラットなシャドウ + hover で shadow-full-card だが、リフト/トランスフォームなし。バッジは全て同一の青色
- **アニメーション**: ゼロ。スクロールトランジション・フェードインなし
- **フッター**: 最小限（コピーライト + ソーシャルアイコン 3つ）。ナビゲーション・説明文なし
- **コンテンツの空白**: ブログ記事 4/6 件に description なし、LinkedIn リンクなし、スキルに経験年数なし
- **未使用デザイントークン**: DESIGN.md でワークフローアクセントカラー（Ship Red, Preview Pink, Develop Blue）+ ヒーローグラデーション + メトリックカードを定義済みだが、StrengthCard のアクセントバー以外で未実装

## 実行戦略

5フェーズ、順次実行。コンテンツ（リスクゼロ）から始め、段階的にUI強化。単一ブランチ、約1 PR。

```
Phase 1: コンテンツ充実（データファイルのみ）
    ↓
Phase 2: カテゴリ別バッジカラー + カードホバーリフト
    ↓
Phase 3: スクロールトリガーアニメーション（useInView + CSS keyframes）
    ↓
Phase 4: ヒーローセクション強化（グラデーション + 統計 + セカンダリCTA）
    ↓
Phase 5: フッター充実 + 最終仕上げ
```

---

## Phase 1: コンテンツ充実（リスク: 低 — データファイルのみ）

### 1a. ブログ記事の description 追加

`src/data/blog.ts` の description が未設定の4記事に1行サマリーを追加:
- DevContainer AWS 記事
- TiDB Cloud Zero 記事
- DevContainer Claude Code voice 記事
- ローカル環境 TiDB 記事

### 1b. ソーシャルリンク

`src/data/social.ts` に LinkedIn を追加:
```ts
{ platform: 'LinkedIn', url: 'https://www.linkedin.com/in/kenta-sato-4180aa252/', icon: 'linkedin', label: 'LinkedIn' }
```
`src/components/icons/SocialIcon.tsx` に `linkedin` アイコンケースを追加。

### 1c. スキル経験年数

`src/types/index.ts` の `Skill` 型にオプショナル `years` フィールドを追加:
```ts
export interface Skill {
  name: string;
  category: SkillCategory;
  level?: SkillLevel;
  years?: number;  // 新規
}
```
`src/data/skills.ts` に履歴書情報ベースの年数を追加。`SkillGrid.tsx` で `{skill.name} · {skill.years}y` 形式で表示。

### 1d. ヒーロー統計データ

`src/types/index.ts` の `SiteMetadata.author` に `stats` 配列を追加:
```ts
author: {
  name: string;
  tagline: string;
  strengths: Strength[];
  stats: { label: string; value: string }[];  // 新規
}
```
`src/data/metadata.ts` に履歴書由来のデータを設定:
- `{ value: '5+', label: '年のSRE経験' }`
- `{ value: '3', label: 'クラウド基盤' }`
- `{ value: '6', label: '技術記事・書籍' }`

### 変更対象ファイル
| ファイル | 変更内容 |
|---------|---------|
| `src/data/blog.ts` | 4記事に description 追加 |
| `src/data/social.ts` | LinkedIn エントリ追加 |
| `src/components/icons/SocialIcon.tsx` | linkedin アイコンケース追加 |
| `src/types/index.ts` | Skill に `years`、author に `stats` 追加 |
| `src/data/skills.ts` | 年数値を追加 |
| `src/data/metadata.ts` | stats 配列を追加 |

---

## Phase 2: バッジカラー + カードホバーリフト（リスク: 低）

### 2a. カテゴリ別バッジカラー

現状、全バッジが `bg-badge-blue-bg text-badge-blue-text` で統一。DESIGN.md のワークフローアクセントカラーが未活用。

`globals.css` の `@theme` に新しいカラートークンを追加:
```css
/* カテゴリバッジ色 — ワークフローアクセントカラーの淡い背景 */
--color-badge-cloud-bg: #ebf5ff;      /* develop-blue 系 */
--color-badge-cloud-text: #0a72ef;
--color-badge-lang-bg: #fdf2f8;       /* preview-pink 系 */
--color-badge-lang-text: #de1d8d;
--color-badge-db-bg: #fff5f5;         /* ship-red 系 */
--color-badge-db-text: #ff5b4f;
--color-badge-tool-bg: #f5f5f5;       /* gray 系 */
--color-badge-tool-text: #4d4d4d;
```

`SkillGrid.tsx` のバッジカラーをカテゴリベースに変更。`expert` レベル（黒背景）は維持。

`BlogCard.tsx` のプラットフォームバッジにも適用 — Zenn（青）、Qiita（緑）、Amazon（オレンジ）。

### 2b. カードホバーリフト

全カードコンポーネントに `hover:-translate-y-2` を追加:
```
className="... transition-all hover:-translate-y-2 hover:shadow-full-card"
```

対象: `ProjectCard`, `BlogCard`, `SocialLinkCard`, `StrengthCard`

### 変更対象ファイル
| ファイル | 変更内容 |
|---------|---------|
| `src/app/globals.css` | バッジカラートークン追加 |
| `src/components/about/SkillGrid.tsx` | カテゴリ別バッジカラー |
| `src/components/projects/ProjectCard.tsx` | ホバーリフト |
| `src/components/blog/BlogCard.tsx` | プラットフォームバッジカラー + ホバーリフト |
| `src/components/contact/SocialLinkCard.tsx` | ホバーリフト |
| `src/components/home/StrengthCard.tsx` | ホバーリフト |

---

## Phase 3: スクロールトリガーアニメーション（リスク: 中）

### 設計判断: CSS keyframes + IntersectionObserver（Framer Motion 不使用）
- バンドルコスト: ゼロ（CSS keyframes は無料、IntersectionObserver はネイティブAPI）
- テストモック不要（Framer Motion は `vi.mock('framer-motion')` が必要）
- DESIGN.md に Framer Motion の指定なし

### 3a. `useInView` カスタムフック（約20行）

新規ファイル: `src/hooks/useInView.ts`
```ts
export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsInView(true); observer.unobserve(el); }
    }, { threshold: 0.1, ...options });
    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);
  return { ref, isInView };
}
```

### 3b. CSS キーフレーム（`globals.css` に追加）

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}
```

### 3c. `AnimateOnScroll` ラッパーコンポーネント（約15行）

新規ファイル: `src/components/ui/AnimateOnScroll.tsx`
```tsx
export function AnimateOnScroll({ children, delay = 0 }: Props) {
  const { ref, isInView } = useInView();
  return (
    <div ref={ref} style={{ animationDelay: `${delay}ms` }}
      className={isInView ? 'animate-fade-in-up' : 'opacity-0'}>
      {children}
    </div>
  );
}
```

### 3d. 各ページセクションへの適用

`AnimateOnScroll` でセクション見出しとカードグリッドをラップ。同一グリッド内のカードにはスタガードディレイ（0, 100, 200ms）を適用。

対象: `page.tsx`（ヒーロー + 強み）, `about/page.tsx`（経歴 + スキル + 学歴）, `projects/page.tsx`, `blog/page.tsx`, `contact/page.tsx`

### `'use client'` 境界について
`AnimateOnScroll` は `'use client'` コンポーネントとして実装。ページ自体はサーバーコンポーネントのまま維持し、子要素として渡す形で使用する。

### 新規作成ファイル
| ファイル | 用途 |
|---------|------|
| `src/hooks/useInView.ts` | IntersectionObserver フック |
| `src/components/ui/AnimateOnScroll.tsx` | ラッパーコンポーネント |

### 変更対象ファイル
| ファイル | 変更内容 |
|---------|---------|
| `src/app/globals.css` | @keyframes fadeInUp 追加 |
| `src/app/page.tsx` | セクションのラップ |
| `src/app/about/page.tsx` | セクションのラップ |
| `src/app/projects/page.tsx` | セクションのラップ |
| `src/app/blog/page.tsx` | セクションのラップ |
| `src/app/contact/page.tsx` | セクションのラップ |

---

## Phase 4: ヒーローセクション強化（リスク: 中）

### 4a. 淡いグラデーション背景

ワークフローアクセントカラーを極低不透明度で使用（DESIGN.md §6「装飾的深度: ヒーローコンテンツ背景の淡いパステルマルチカラーグラデーション」）:

```css
.hero-gradient {
  background: radial-gradient(
    ellipse at 50% 0%,
    rgba(10, 114, 239, 0.06) 0%,    /* develop-blue */
    rgba(222, 29, 141, 0.04) 40%,   /* preview-pink */
    rgba(255, 91, 79, 0.02) 70%,    /* ship-red */
    transparent 100%
  );
}
```

### 4b. ヒーロー統計カード

`HeroSection.tsx` にインラインで実装（別コンポーネントファイル不要 — span 3つ）:
```tsx
<div className="mt-32 flex gap-32">
  {stats.map(stat => (
    <div key={stat.label} className="text-center">
      <span className="text-section-heading text-vercel-black">{stat.value}</span>
      <span className="text-caption text-gray-500">{stat.label}</span>
    </div>
  ))}
</div>
```

### 4c. セカンダリ CTA

既存のダーク「Projects を見る」CTA の隣に「About を見る」ゴーストボタンを追加:
```tsx
<Link href="/about/" className="... rounded-standard shadow-light-ring ...">
  About を見る
</Link>
```

### 変更対象ファイル
| ファイル | 変更内容 |
|---------|---------|
| `src/app/globals.css` | .hero-gradient クラス追加 |
| `src/components/home/HeroSection.tsx` | グラデーション背景、統計カード、セカンダリCTA |
| `src/types/index.ts` | Phase 1 で追加済み |
| `src/data/metadata.ts` | Phase 1 で追加済み |

---

## Phase 5: フッター充実（リスク: 低）

### 5a. マルチセクションフッター

Footer を単一行から複数セクション構成に拡張:
- **左カラム**: サイト名 + 1行説明
- **中央カラム**: ナビゲーションリンク（Home, About, Projects, Blog, Contact）
- **右カラム**: ソーシャルアイコン
- **下段**: コピーライト

### 5b. Footer props の更新

現在の `Footer` は `authorName` + `socialLinks` を受け取る。`navLinks` と `siteDescription` を追加（`src/data/navigation.ts` と `src/data/metadata.ts` から取得可能）。

### 変更対象ファイル
| ファイル | 変更内容 |
|---------|---------|
| `src/components/layout/Footer.tsx` | マルチセクションレイアウト |
| `src/app/layout.tsx` | Footer に navLinks + siteDescription を渡す |

---

## 検証

全フェーズ完了後:
```bash
npm test           # 既存テスト全パス
npm run lint       # エラーゼロ
npm run type-check # エラーゼロ
npm run build      # Static Export 成功
```

目視確認（開発サーバー）:
- [ ] Home: グラデーション表示、統計カード描画、CTA 2つ動作、強みカードがアニメーションで表示
- [ ] About: タイムラインがアニメーション、スキルバッジにカテゴリカラー + 年数表示
- [ ] Projects: カードホバーでリフト、バッジに色分け
- [ ] Blog: カードホバーでリフト、プラットフォームバッジに色分け、description 表示
- [ ] Contact: カードホバーでリフト、LinkedIn リンク存在
- [ ] Footer: デスクトップで3カラム構成、モバイルでスタック
- [ ] Mobile: 全アニメーション動作、レイアウトオーバーフローなし

---

## 実行コマンド一覧

| Phase | コマンド |
|-------|---------|
| 1 | `/add-feature コンテンツ充実（blog description・LinkedIn・スキル年数・ヒーロー統計データ）。設計は docs/ideas/content-ux-enrichment.md の Phase 1 を参照` |
| 2 | `/add-feature カテゴリ別バッジカラーとカードホバーリフト。設計は docs/ideas/content-ux-enrichment.md の Phase 2 を参照` |
| 3 | `/add-feature スクロールトリガーアニメーション（useInView + CSS keyframes）。設計は docs/ideas/content-ux-enrichment.md の Phase 3 を参照` |
| 4 | `/add-feature ヒーローセクション強化（グラデーション・統計カード・セカンダリCTA）。設計は docs/ideas/content-ux-enrichment.md の Phase 4 を参照` |
| 5 | `/add-feature フッターマルチセクション化。設計は docs/ideas/content-ux-enrichment.md の Phase 5 を参照` |

**依存関係:** Phase 1 → Phase 4（統計データを Phase 1 で追加、Phase 4 で表示）。推奨実行順: 1 → 2 → 3 → 4 → 5
