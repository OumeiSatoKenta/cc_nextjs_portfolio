import { SiteMetadata } from '@/types';

export const siteMetadata: SiteMetadata = {
  name: 'Portfolio',
  title: 'エンジニアポートフォリオ',
  description:
    'マルチクラウド対応力・AI駆動開発・パフォーマンス改善の3つの強みを示すエンジニアポートフォリオサイト',
  url: 'https://example.com',
  ogImage: '/images/og-image.png',
  author: {
    name: 'Your Name',
    tagline: 'Software Engineer',
    strengths: [
      {
        title: 'マルチクラウド',
        description: 'AWS・GCPを活用したクラウドインフラ設計・構築',
        accentColor: 'develop',
      },
      {
        title: 'AI駆動開発',
        description: 'AI技術を活用した開発プロセスの効率化',
        accentColor: 'preview',
      },
      {
        title: 'パフォーマンス改善',
        description: 'Webアプリケーションの高速化・最適化',
        accentColor: 'ship',
      },
    ],
  },
};
