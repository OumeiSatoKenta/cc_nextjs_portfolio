import {
  ACTIVITY_CATEGORY_BADGE_CLASS,
  ACTIVITY_CATEGORY_LABEL,
} from '@/components/activity/categoryMaps';
import type { Activity } from '@/types';

interface ActivityPreviewProps {
  activities: Activity[];
  limit?: number;
}

export function ActivityPreview({ activities, limit = 3 }: ActivityPreviewProps) {
  const latest = [...activities].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);

  return (
    <ul className="flex flex-col gap-16">
      {latest.map((activity) => {
        const year = activity.date.slice(0, 4);
        const yearLabel = activity.ongoing ? `${year} 〜 現在` : year;
        return (
          <li
            key={activity.id}
            className="flex flex-wrap items-center gap-16 rounded-comfortable bg-pure-white p-24 shadow-subtle-card"
          >
            <time dateTime={activity.date} className="font-geist-mono text-caption text-gray-500">
              {yearLabel}
            </time>
            <span
              className={`rounded-pill px-10 py-3 font-medium text-caption ${ACTIVITY_CATEGORY_BADGE_CLASS[activity.category]}`}
            >
              {ACTIVITY_CATEGORY_LABEL[activity.category]}
            </span>
            <p className="flex-1 text-body-small text-vercel-black">{activity.title}</p>
          </li>
        );
      })}
    </ul>
  );
}
