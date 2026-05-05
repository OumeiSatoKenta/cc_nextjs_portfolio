import type { SiteMetadata } from '@/types';

export const siteMetadata: SiteMetadata = {
  name: 'Kenta Sato',
  title: 'Kenta Sato | SRE Engineer Portfolio',
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
    introduction:
      'SRE エンジニアとして 5 年以上の経験を持ち、AWS・Google Cloud のマルチクラウド環境で Terraform / Terragrunt による IaC 設計・構築・運用を一貫して担当しています。負荷試験の設計・実施からボトルネック特定、DB チューニング、コスト最適化まで、定量的な成果を積み上げてきました。\n\n直近では Terraform + Terragrunt によるマルチ開発環境（6 環境）の基盤構築、NAT Gateway 自動化や ALB 共有化などのコスト最適化設計・実装、CI/CD パイプライン構築を実施。その前のプロジェクトでは Google Cloud 上のインフラ設計、60 件以上のアラート設計、負荷試験環境構築を 1 人で担当しました。\n\nまた、Claude Code（AI コーディングエージェント）を複数プロジェクトで導入・主導しており、Skills・Agents・MCP 連携など AI と協働する開発プロセスの構築に豊富な知見を持っています。\n\n今後は SRE の知見をベースに、プラットフォームエンジニアリングの領域へ踏み出し、開発チーム全体の生産性を底上げする仕組みづくりに挑戦したいと考えています。AI 駆動開発の組織的な導入・定着を推進し、エンジニアリングと AI が自然に融合するチーム文化を築くことが次の目標です。',
    personalInfo: {
      type: '専門家 × エクスパンダー',
      typeDescription:
        '特定の専門性を内省的に追求し、論理的・分析的に課題の深掘りや原因究明を行うタイプ。安定した環境で結果を着実に積み上げるスタイルが得意。',
      topQualities: [
        {
          title: '論理',
          description: '客観的に実現可能性を評価し、整理・分析の結果から判断する',
        },
        {
          title: '着実',
          description: '粘り強く着実に物事を進め、リスクを回避し安全に進める',
        },
        {
          title: '規律',
          description: 'ルールを決めて公正な環境を作り、管理する仕組みでスムーズに進行する',
        },
      ],
      selfAwareness: [
        '専門性を深く追求し、課題の根本原因を特定するアプローチが得意',
        '再現性のあるプロセスとガードレールを整え、チームが安心して開発に集中できる土台を作る',
        '柔軟な対応や社交性は意識的にトレーニング中。レビュー・対話を重視している',
      ],
      source: {
        name: 'アッテル',
        url: 'https://attelu.jp/',
      },
    },
  },
};
