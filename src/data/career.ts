import type { Career } from '@/types';

export const careers: Career[] = [
  {
    company: '株式会社オルトプラス',
    role: 'SRE エンジニア',
    period: { start: '2026-02' },
    description:
      'モバイルゲームプロジェクトの SRE として、Terraform + Terragrunt による AWS マルチ開発環境の IaC 設計・構築・運用を担当。',
    achievements: [
      'Terraform + Terragrunt によるマルチ開発環境（dev1〜dev6）の IaC 設計・構築・運用',
      'NAT Gateway 夜間・休日自動削除/再作成で月額約 53% 削減',
      'ALB 共有化で年間約 $970 節約',
      'Claude Code 開発フロー整備（Skills 20 種 / Agents 7 種 / MCP 連携 7 サーバー）',
      'WAF v2 / IAM 最小権限 / Well-Architected Security MCP によるセキュリティ検証自動化',
    ],
    technologies: [
      'AWS',
      'Terraform',
      'Terragrunt',
      'TiDB',
      'Docker',
      'Python',
      'GitHub',
      'Claude Code',
    ],
  },
  {
    company: 'モバイルゲーム企業 A 社',
    role: 'SRE エンジニア',
    period: { start: '2025-10', end: '2026-04' },
    description:
      'オルトプラスより業務委託として参画。モバイルゲーム 2 タイトルのライブインフラを 1 人で担当。Google Cloud 全環境を Terraform で構築。',
    achievements: [
      'Terraform で GCP 全環境（dev/staging/prod）構築: Cloud Run / Cloud SQL / Redis / Firestore 等 10+ サービス',
      '60 件以上のアラートポリシー設計・構築',
      'GitHub Actions による Terraform CI/CD（plan/apply 自動化、環境別ワークフロー分離）',
      'CDN / LB / DNS 導入（Managed SSL / Cloud CDN / Global LB）',
      'シーズン運用連動のインフラライフサイクル管理',
    ],
    technologies: ['Google Cloud', 'Terraform', 'Docker', 'Python', 'GitHub', 'Claude Code'],
  },
  {
    company: '大手美容メディア企業 B 社',
    role: 'DBRE エンジニア',
    period: { start: '2024-10', end: '2025-09' },
    description:
      'オルトプラスより業務委託として参画。大規模美容メディアのオンプレ DB サーバーを AWS DMS 経由で TiDB へ移行するプロジェクトを担当。',
    achievements: [
      'オンプレ本番 DB → AWS DMS → TiDB のデータレプリケーション + 負荷試験',
      'AWS DMS 設定を Terraform でコード化、再現性あるデプロイ環境構築',
      '外部キー制約・ユニークキー制約を考慮した移行順序設計',
      '新人エンジニア受け入れ教育カリキュラム作成・育成',
    ],
    technologies: [
      'AWS',
      'TiDB',
      'Terraform',
      'AWS CDK',
      'MySQL',
      'SQL Server',
      'Python',
      'GitHub',
    ],
  },
  {
    company: '大手 Web プラットフォーム企業 C 社',
    role: 'SRE メイン担当',
    period: { start: '2023-06', end: '2024-09' },
    description:
      'オルトプラスより業務委託として参画。オンラインクレーンゲームサービスの SRE として、ユーザー規模約 4 倍の成長フェーズを支える。',
    achievements: [
      'ECS / Aurora / ElastiCache / CloudFront / ALB 管理・運用、メトリクス監視、負荷対策',
      'StepFunctions + Lambda による Aurora オートスケール運用構築',
      'k6 負荷試験の実施、ボトルネック洗い出し + 事前対策',
      'NewRelic / Mackerel アラート閾値調整、Aurora スロークエリ監視・改善提案',
    ],
    technologies: ['AWS', 'Docker', 'Laravel', 'Python', 'GitHub'],
  },
  {
    company: '株式会社シャノン',
    role: 'サーバー / SRE エンジニア',
    period: { start: '2021-04', end: '2023-05' },
    description: '20 年続く MA SaaS（Shanon Marketing Platform）のサーバー / SRE を新卒から担当。',
    achievements: [
      'DB チューニング（インデックス・ユニークキー）、データ登録処理の分割化',
      'プログレスバー処理の非同期化によるレスポンス改善',
      'Jenkins パイプラインで AWS 環境の作成・削除自動化',
      'Capybara による E2E 自動化テスト、QA テストケース作成・実施',
      '新人入社研修カリキュラム作成',
    ],
    technologies: ['AWS', 'Docker', 'Perl', 'Ruby on Rails', 'PostgreSQL', 'Jenkins', 'GitHub'],
  },
];
