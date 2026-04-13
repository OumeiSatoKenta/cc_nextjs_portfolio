import type { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 'portfolio-site',
    title: 'Portfolio Site (Next.js)',
    description:
      'Next.js 14 App Router + Static Export で構築したポートフォリオサイト。Tailwind CSS によるデザインシステム実装、Jest + React Testing Library によるコンポーネントテスト、GitHub Actions CI/CD を含む。',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Jest', 'GitHub Actions'],
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
];
