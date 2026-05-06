import type { ActivityCategory } from '@/types';

export const ACTIVITY_CATEGORY_LABEL: Record<ActivityCategory, string> = {
  meetup: 'ミートアップ',
  conference: 'カンファレンス',
  'study-group': '勉強会',
  publication: '出版',
  oss: 'OSS',
  other: 'その他',
};

export const ACTIVITY_CATEGORY_BADGE_CLASS: Record<ActivityCategory, string> = {
  meetup: 'bg-badge-cloud-bg text-badge-cloud-text',
  conference: 'bg-badge-db-bg text-badge-db-text',
  'study-group': 'bg-badge-lang-bg text-badge-lang-text',
  publication: 'bg-vercel-black text-pure-white',
  oss: 'bg-badge-tool-bg text-badge-tool-text',
  other: 'bg-badge-tool-bg text-badge-tool-text',
};
