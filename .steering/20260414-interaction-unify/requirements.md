# 要求定義: インタラクション統一 (U2)

## 目的

全カード・ボタンのトランジション/アクティブ状態を統一パターンに揃え、サイト全体で一貫したインタラクションフィードバックを提供する。

## 要求

### R1: トランジション統一

全インタラクティブ要素に `transition-all duration-200` を適用し、トランジションの種類と速度を統一する。

### R2: アクティブフィードバック追加

- ボタン（Primary/Secondary）: `active:scale-[0.98]` でわずかな押下感
- カード: 既存の hover パターン維持 + `transition-all duration-200` に統一
- アイコンボタン（ハンバーガー、Footer ソーシャルアイコン）: `active:scale-95` で明確な押下感

### R3: 既存ホバー動作の維持

hover エフェクト自体（opacity, shadow, translate 等）は変更しない。トランジション制御と active 状態のみ変更する。

## 対象ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/components/home/HeroSection.tsx` | Primary/Secondary ボタンの transition + active:scale |
| `src/components/projects/ProjectCard.tsx` | `transition` → `transition-all duration-200` |
| `src/components/blog/BlogCard.tsx` | 同上 |
| `src/components/home/StrengthCard.tsx` | 同上 |
| `src/components/contact/SocialLinkCard.tsx` | 同上 |
| `src/components/layout/Header.tsx` | SheetTrigger に `active:scale-95` |
| `src/components/layout/Footer.tsx` | ソーシャルアイコンに `transition-all duration-200 active:scale-95` |

## 対象外

- ナビゲーションリンクの `transition-colors` は変更しない（テキストリンクにスケールは不適切）
- Phase 3 の C2 テキスト変更（"Side Projects を見る"）は本タスクに含めない
