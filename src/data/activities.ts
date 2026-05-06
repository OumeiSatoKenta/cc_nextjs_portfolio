import type { Activity } from '@/types';

export const activities: Activity[] = [
  {
    id: 'tiug-organizer-2024',
    title: 'TiDB User Group (TiUG) 運営参加',
    date: '2024-03',
    category: 'meetup',
    description:
      '2024 年 3 月から運営メンバーとして参加。3 ヶ月ごとの MeetUp Event 企画・運営を担当し、TiDB 日本コミュニティの活性化に貢献。',
    role: '運営メンバー',
    url: 'https://tiug.connpass.com/',
    tags: ['TiDB', 'コミュニティ運営'],
    ongoing: true,
  },
  {
    id: 'aws-cert-book-2022',
    title: 'AWS認定資格 ソリューションアーキテクトアソシエイトの教科書 共著',
    date: '2022-08',
    category: 'publication',
    description:
      '70 名の共著者で執筆した AWS SAA 対策本。3 ページの執筆・レビューに加え、進捗管理 GAS ツールを作成。',
    role: '執筆・進捗管理 GAS 開発',
    url: 'https://www.amazon.co.jp/dp/B0BCPNZ9GJ',
    tags: ['AWS', 'SAA', '技術書'],
  },
  {
    id: 'amplify-handson-book-2023',
    title: 'AWS Amplify ハンズオン本 編集',
    date: '2023-09',
    category: 'publication',
    description:
      'AWS ハンズオン虎の巻シリーズ「Amplify でフルスタックな開発体験をしよう」の編集を担当。',
    role: '編集',
    url: 'https://www.amazon.co.jp/dp/B0CH7LLX2H',
    tags: ['AWS Amplify', '技術書'],
  },
  {
    id: 'jaws-genai-ongoing',
    title: 'JAWS / 生成AI 勉強会 継続参加',
    date: '2024',
    category: 'study-group',
    description:
      'AWS JAWS コミュニティや生成 AI 勉強会に継続参加。最新技術のキャッチアップとエンジニア同士のナレッジシェアを実践。',
    role: '参加・登壇',
    tags: ['AWS', 'JAWS', '生成AI'],
  },
];
