import type { Skill } from '@/types';

export const skills: Skill[] = [
  // Cloud / IaC (expert → advanced)
  {
    name: 'AWS',
    category: 'cloud',
    level: 'expert',
    years: 3,
    description: 'VPC / ECS / Lambda / CloudFront / S3 / RDS 等 30+ サービスの設計・構築・運用',
  },
  {
    name: 'Google Cloud',
    category: 'cloud',
    level: 'advanced',
    years: 1,
    description: 'GCE / Cloud SQL / Cloud CDN / Cloud DNS 等の設計・構築',
  },
  {
    name: 'Terraform',
    category: 'cloud',
    level: 'advanced',
    years: 2,
    description: 'マルチ環境 IaC 設計、モジュール化、CI/CD パイプライン構築',
  },
  {
    name: 'Terragrunt',
    category: 'cloud',
    level: 'advanced',
    years: 1,
    description: 'DRY な Terraform 構成管理、6 環境のマルチ環境基盤',
  },

  // Languages (intermediate — 全て実務利用)
  {
    name: 'Shell Script',
    category: 'language',
    level: 'intermediate',
    years: 7,
    description: '運用自動化・CI/CD スクリプト・監視ツール作成',
  },
  { name: 'Python', category: 'language', level: 'intermediate', years: 4 },
  { name: 'SQL', category: 'language', level: 'intermediate', years: 4 },
  { name: 'Perl', category: 'language', level: 'intermediate', years: 3 },
  { name: 'Ruby', category: 'language', level: 'intermediate', years: 2 },

  // Database (advanced → intermediate)
  {
    name: 'Aurora MySQL',
    category: 'database',
    level: 'advanced',
    years: 3,
    description: 'インデックス設計・スロークエリ改善・リードレプリカ運用',
  },
  { name: 'PostgreSQL', category: 'database', level: 'intermediate', years: 2 },
  {
    name: 'Redis / Valkey',
    category: 'database',
    level: 'intermediate',
    years: 3,
    description: 'セッション管理・キャッシュ設計',
  },
  {
    name: 'TiDB',
    category: 'database',
    level: 'intermediate',
    years: 1,
    description: 'TiDB Cloud / TiUG 運営メンバーとして活用',
  },
  { name: 'SQL Server', category: 'database', level: 'intermediate', years: 1 },

  // DevOps / Tools (advanced → intermediate)
  {
    name: 'Docker',
    category: 'tool',
    level: 'advanced',
    years: 4,
    description: 'マルチステージビルド・開発環境コンテナ化',
  },
  { name: 'Git / GitHub', category: 'tool', level: 'advanced', years: 7 },
  { name: 'Jenkins', category: 'tool', level: 'advanced', years: 2 },
  {
    name: 'Claude Code (AI)',
    category: 'tool',
    level: 'advanced',
    years: 1,
    description: 'Skills / Agents / MCP 連携による AI 駆動開発プロセス構築',
  },
  { name: 'Nginx', category: 'tool', level: 'intermediate', years: 3 },
  { name: 'Linux (CentOS/Ubuntu)', category: 'tool', level: 'intermediate', years: 7 },
];
