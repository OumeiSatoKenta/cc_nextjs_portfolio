import type { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 'portfolio-site',
    title: 'Portfolio Site (Next.js)',
    description:
      'Next.js 16 App Router + Static Export で構築したポートフォリオサイト。Tailwind CSS v4 + shadcn/ui によるデザインシステム実装、Vitest + React Testing Library によるコンポーネントテスト、Biome によるフォーマット・リント、GitHub Actions CI/CD を含む。',
    technologies: [
      'Next.js 16',
      'TypeScript',
      'Tailwind CSS v4',
      'shadcn/ui',
      'Vitest',
      'Biome',
      'GitHub Actions',
    ],
    githubUrl: 'https://github.com/OumeiSatoKenta/cc_nextjs_portfolio',
    highlights: [
      'DESIGN.md 駆動のデザインシステム（Vercel 風）',
      'Claude Code による AI 駆動開発ワークフロー',
      'Static Export + CloudFront 配信で高速・低コスト',
    ],
    featured: true,
  },
  {
    id: 'portfolio-infra',
    title: 'Portfolio Infrastructure (Terraform)',
    description:
      'ポートフォリオサイトの AWS インフラを Terraform で IaC 管理。CloudFront + S3 + ACM + Route 53 による静的サイトホスティング基盤。',
    technologies: ['Terraform', 'AWS', 'CloudFront', 'S3', 'ACM', 'Route 53'],
    githubUrl: 'https://github.com/OumeiSatoKenta/cc_aws_portfolio',
    highlights: [
      'Terraform によるインフラ全体の IaC 管理',
      'CloudFront + S3 オリジンアクセスコントロール（OAC）',
      'GitHub Actions による plan/apply 自動化',
    ],
    featured: true,
  },
  {
    id: 'tiug-community',
    title: 'TiDB User Group (TiUG) 運営',
    description:
      '2024 年 3 月から運営メンバーとして参加し、丸 2 年にわたり TiDB ユーザーグループの 3 ヶ月に 1 度の MeetUp Event の企画・運営を担当。TiDB の普及と日本コミュニティの活性化に貢献。',
    technologies: ['TiDB', 'コミュニティ運営', 'connpass'],
    liveUrl: 'https://tiug.connpass.com/',
    linkLabel: 'Connpass',
    highlights: ['3 ヶ月ごとの定期 MeetUp Event の企画・運営', 'TiDB 日本コミュニティの活性化'],
    featured: false,
  },
  {
    id: 'aws-cert-book',
    title: 'AWS認定資格 ソリューションアーキテクトアソシエイトの教科書',
    description:
      '70 名の共著者で執筆した AWS SAA 対策本（Kindle）。3 ページの執筆・レビューに加え、進捗管理 GAS ツールを作成。',
    technologies: ['AWS', 'SAA', 'Kindle', '技術書執筆'],
    liveUrl: 'https://www.amazon.co.jp/dp/B0DK3KFYWQ',
    linkLabel: 'Amazon',
    highlights: [
      '70 名の共著プロジェクトで執筆・レビュー・進捗管理を担当',
      'ダウンロード数 16,500 件突破',
    ],
    metrics: [
      { label: '共著者数', value: '70' },
      { label: 'ダウンロード数', value: '16,500' },
    ],
    featured: false,
  },
  {
    id: 'amplify-handson-book',
    title: 'AWS Amplify ハンズオン本 編集',
    description:
      'AWS ハンズオン虎の巻シリーズ「Amplify でフルスタックな開発体験をしよう」の編集を担当。',
    technologies: ['AWS Amplify', 'Kindle', '技術書編集'],
    liveUrl: 'https://www.amazon.co.jp/dp/B0DTJMCR42',
    linkLabel: 'Amazon',
    highlights: ['ハンズオン形式の技術書の編集・校正'],
    featured: false,
  },
  {
    id: 'jaws-genai-study',
    title: 'JAWS / 生成AI 勉強会',
    description:
      'AWS JAWS コミュニティや生成 AI 勉強会に積極参加し、最新技術のキャッチアップとエンジニア同士のナレッジシェアを実践。',
    technologies: ['AWS', 'JAWS', '生成AI', 'コミュニティ'],
    highlights: ['AWS JAWS コミュニティへの継続的な参加', '生成 AI 関連勉強会でのナレッジシェア'],
    featured: false,
  },
];
