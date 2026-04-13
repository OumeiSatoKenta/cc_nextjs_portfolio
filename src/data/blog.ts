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
    url: 'https://www.amazon.co.jp/AWS%E8%AA%8D%E5%AE%9A%E8%B3%87%E6%A0%BC-%E3%82%BD%E3%83%AA%E3%83%A5%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%82%A2%E3%83%BC%E3%82%AD%E3%83%86%E3%82%AF%E3%83%88%E3%82%A2%E3%82%BD%E3%82%B7%E3%82%A8%E3%82%A4%E3%83%88%E3%81%AE%E6%95%99%E7%A7%91%E6%9B%B8-%E5%90%88%E6%A0%BC%E3%81%B8%E5%B0%8E%E3%81%8F%E8%99%8E%E3%81%AE%E5%B7%BB-CloudTech%E6%9B%B8%E7%B1%8D%E4%BD%9C%E6%88%90%E5%A7%94%E5%93%A1%E4%BC%9A-ebook/dp/B0BCPNZ9GJ',
    publishedAt: '2024-08-01',
    platform: 'amazon',
    description:
      '70 名の共著プロジェクトに参加。3 ページの執筆・レビュー・進捗管理 GAS ツール作成を担当。ダウンロード 16,500 件。',
    tags: ['AWS', 'SAA', 'Kindle'],
  },
  {
    title: 'Amplify でフルスタックな開発体験をしよう【AWS ハンズオン虎の巻シリーズ】',
    url: 'https://www.amazon.co.jp/Amplify%E3%81%A7%E3%83%95%E3%83%AB%E3%82%B9%E3%82%BF%E3%83%83%E3%82%AF%E3%81%AA%E9%96%8B%E7%99%BA%E4%BD%93%E9%A8%93%E3%82%92%E3%81%97%E3%82%88%E3%81%86%E3%80%90AWS%E3%83%8F%E3%83%B3%E3%82%BA%E3%82%AA%E3%83%B3%E8%99%8E%E3%81%AE%E5%B7%BB%E3%82%B7%E3%83%AA%E3%83%BC%E3%82%BA%E3%80%91-Amplify%E3%81%A7%E3%81%AE%E9%96%8B%E7%99%BA%E4%BD%93%E9%A8%93%E3%82%92%E9%80%9A%E3%81%98%E3%81%A6%E5%88%9D%E5%AD%A6%E8%80%85%E3%81%A7%E3%82%82%E3%83%95%E3%83%AB%E3%82%B9%E3%82%BF%E3%83%83%E3%82%AF%E3%81%AA%E7%9F%A5%E8%AD%98%E3%81%8C%E8%BA%AB%E3%81%AB%E3%81%A4%E3%81%8F%EF%BC%81-%E7%9F%B3%E4%BA%95-%E6%B9%A7-ebook/dp/B0CH7LLX2H/ref=sr_1_3?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=21GPOKZOTG2HZ&dib=eyJ2IjoiMSJ9.xWLfEwIygqRpTNa8xnPM5IORLWUHs7yOW6HMEVdyM1SPZWLQqia1tyGUhauWec9q_TOBzU4r2HEcV2SJb4FqcPDn0RKmDko2EwUOrqQs7avGwXhtJzMGm1smve2b3yHpBNj0oJYbs_nnVdGKF0dq7f_82U35jLbCu0HB5_ZlyEnsGd27ywuaznHKXTEVFzTM.jyZwAu1C6dRZKRJq76EP9yun9doLNnsN0ro6YMovNsA&dib_tag=se&keywords=%E4%BD%90%E8%97%A4%E5%81%A5%E5%A4%AA&qid=1776075603&s=digital-text&sprefix=%E4%BD%90%E8%97%A4%E5%81%A5%E5%A4%AA%2Cdigital-text%2C227&sr=1-3',
    publishedAt: '2024-09-01',
    platform: 'amazon',
    description: 'AWS ハンズオン虎の巻シリーズの編集担当として参加。',
    tags: ['AWS', 'Amplify', 'Kindle'],
  },
];
