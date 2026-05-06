import type { BlogPost } from '@/types';

export const blogPosts: BlogPost[] = [
  {
    title: 'DevContainerでAWSチーム開発環境を統一する — ツールバラつきゼロへの実践ガイド',
    url: 'https://zenn.dev/satoukenta/articles/devcontainer-aws-team-setup',
    publishedAt: '2026-04-12',
    platform: 'zenn',
    description:
      'DevContainerでAWS CLI・Terraform・Session Managerなどのツールバージョンを統一し、チーム開発環境の差分をゼロにする方法を解説。',
    tags: ['DevContainer', 'AWS', 'チーム開発'],
  },
  {
    title: 'TiDB Cloud Zero入門 — curlで作るDBにpytidbでベクトル検索',
    url: 'https://zenn.dev/satoukenta/articles/tidb-cloud-zero-intro',
    publishedAt: '2026-03-16',
    platform: 'zenn',
    description:
      'TiDB Cloud Zeroをcurlだけでセットアップし、pytidbでベクトル検索を実装するハンズオン形式の入門記事。',
    tags: ['TiDB', 'ベクトル検索', 'Python'],
  },
  {
    title: 'DevContainer内でClaude Codeの /voice を使う — PulseAudio TCP転送でマイクを通す',
    url: 'https://zenn.dev/satoukenta/articles/devcontainer-claude-code-voice',
    publishedAt: '2026-03-16',
    platform: 'zenn',
    description:
      'DevContainer内でClaude Codeの音声入力機能を使うため、PulseAudio TCP転送でホストのマイクをコンテナに通す設定方法。',
    tags: ['DevContainer', 'Claude Code', 'PulseAudio'],
  },
  {
    title: 'ローカル環境で目指す、理想のTiDB開発ライフ',
    url: 'https://qiita.com/Sato-Kenta/items/617d24808a163118be9c',
    publishedAt: '2025-12-23',
    platform: 'qiita',
    description:
      'Docker ComposeでTiDBクラスタをローカルに構築し、開発・テスト・学習に使えるコンテナ化された開発環境を紹介。',
    tags: ['TiDB', 'Database', '開発環境コンテナ化'],
  },
  {
    title: 'AWS 認定資格 ソリューションアーキテクトアソシエイトの教科書: 合格へ導く虎の巻',
    url: 'https://www.amazon.co.jp/dp/B0BCPNZ9GJ',
    publishedAt: '2022-08-01',
    platform: 'amazon',
    description:
      '70 名の共著プロジェクトに参加。3 ページの執筆・レビュー・進捗管理 GAS ツール作成を担当。ダウンロード 16,500 件。',
    tags: ['AWS', 'SAA', 'Kindle'],
  },
  {
    title: 'Amplify でフルスタックな開発体験をしよう【AWS ハンズオン虎の巻シリーズ】',
    url: 'https://www.amazon.co.jp/dp/B0CH7LLX2H',
    publishedAt: '2023-09-01',
    platform: 'amazon',
    description: 'AWS ハンズオン虎の巻シリーズの編集担当として参加。',
    tags: ['AWS', 'Amplify', 'Kindle'],
  },
];
