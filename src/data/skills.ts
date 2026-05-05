import type { Skill } from '@/types';

export const skills: Skill[] = [
  // Cloud / IaC (expert → advanced)
  {
    name: 'AWS',
    category: 'cloud',
    level: 'expert',
    years: 3,
    description: 'VPC / ECS / Lambda / CloudFront / S3 / RDS 等 30+ サービスの設計・構築・運用',
    icon: 'Cloud',
  },
  {
    name: 'Google Cloud',
    category: 'cloud',
    level: 'advanced',
    years: 1,
    description: 'GCE / Cloud SQL / Cloud CDN / Cloud DNS 等の設計・構築',
    icon: 'Cloud',
  },
  {
    name: 'Terraform',
    category: 'cloud',
    level: 'advanced',
    years: 2,
    description: 'マルチ環境 IaC 設計、モジュール化、CI/CD パイプライン構築',
    icon: 'Boxes',
  },
  {
    name: 'Terragrunt',
    category: 'cloud',
    level: 'advanced',
    years: 1,
    description: 'DRY な Terraform 構成管理、6 環境のマルチ環境基盤',
    icon: 'Boxes',
  },

  // Languages (intermediate — 全て実務利用)
  {
    name: 'Shell Script',
    category: 'language',
    level: 'intermediate',
    years: 7,
    description: '運用自動化・CI/CD スクリプト・監視ツール作成',
    icon: 'Terminal',
  },
  { name: 'Python', category: 'language', level: 'intermediate', years: 4, icon: 'Code' },
  { name: 'SQL', category: 'language', level: 'intermediate', years: 4, icon: 'Database' },
  { name: 'Perl', category: 'language', level: 'intermediate', years: 3, icon: 'Code' },
  { name: 'Ruby', category: 'language', level: 'intermediate', years: 2, icon: 'Gem' },

  // Database (advanced → intermediate)
  {
    name: 'Aurora MySQL',
    category: 'database',
    level: 'advanced',
    years: 3,
    description: 'インデックス設計・スロークエリ改善・リードレプリカ運用',
    icon: 'Database',
  },
  {
    name: 'PostgreSQL',
    category: 'database',
    level: 'intermediate',
    years: 2,
    icon: 'Database',
  },
  {
    name: 'Redis / Valkey',
    category: 'database',
    level: 'intermediate',
    years: 3,
    description: 'セッション管理・キャッシュ設計',
    icon: 'Zap',
  },
  {
    name: 'TiDB',
    category: 'database',
    level: 'intermediate',
    years: 1,
    description: 'TiDB Cloud / TiUG 運営メンバーとして活用',
    icon: 'Database',
  },
  { name: 'SQL Server', category: 'database', level: 'intermediate', years: 1, icon: 'Database' },

  // DevOps / Tools (advanced → intermediate)
  {
    name: 'Docker',
    category: 'tool',
    level: 'advanced',
    years: 4,
    description: 'マルチステージビルド・開発環境コンテナ化',
    icon: 'Container',
  },
  { name: 'Git / GitHub', category: 'tool', level: 'advanced', years: 7, icon: 'GitBranch' },
  { name: 'Jenkins', category: 'tool', level: 'advanced', years: 2, icon: 'Workflow' },
  {
    name: 'Claude Code (AI)',
    category: 'tool',
    level: 'advanced',
    years: 1,
    description: 'Skills / Agents / MCP 連携による AI 駆動開発プロセス構築',
    icon: 'Sparkles',
  },
  { name: 'Nginx', category: 'tool', level: 'intermediate', years: 3, icon: 'Server' },
  {
    name: 'Linux (CentOS/Ubuntu)',
    category: 'tool',
    level: 'intermediate',
    years: 7,
    icon: 'Monitor',
  },
];
