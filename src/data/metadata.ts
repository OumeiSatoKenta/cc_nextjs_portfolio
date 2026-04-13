import type { SiteMetadata } from '@/types';

export const siteMetadata: SiteMetadata = {
  name: 'Portfolio',
  title: 'エンジニアポートフォリオ',
  description:
    'マルチクラウド対応力・AI駆動開発・パフォーマンス改善の3つの強みを示すエンジニアポートフォリオサイト',
  url: 'https://example.com',
  ogImage: '/images/og-image.png',
  author: {
    name: '佐藤健太',
    tagline: 'SRE Engineer — Multi-Cloud · IaC · AI-Driven Development',
    strengths: [
      {
        title: 'マルチクラウド',
        description:
          'AWS・Google Cloud の両クラウドで Terraform / Terragrunt による IaC 設計・構築・運用を実務で担当しています。',
        accentColor: 'develop',
      },
      {
        title: 'AI駆動開発',
        description:
          'Claude Code の導入を複数プロジェクトで主導。Skills・Agents・MCP 連携によるコードレビュー自動化と設計書生成を実践しています。',
        accentColor: 'preview',
      },
      {
        title: 'パフォーマンス改善',
        description:
          '負荷試験の設計・実施からボトルネック特定、DB インデックス・スロークエリ改善、コスト最適化まで定量的な成果を積み上げています。',
        accentColor: 'ship',
      },
    ],
    stats: [
      { value: '5+', label: '年のSRE経験' },
      { value: '3', label: 'クラウド基盤' },
      { value: '6', label: '技術記事・書籍' },
    ],
  },
};
