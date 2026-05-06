import {
  ACTIVITY_CATEGORY_BADGE_CLASS,
  ACTIVITY_CATEGORY_LABEL,
} from '@/components/activity/categoryMaps';
import type { Activity } from '@/types';

function formatDate(date: string): string {
  if (date.length === 4) return `${date} 年`;
  if (date.length === 7) return `${date.slice(0, 4)} 年 ${Number(date.slice(5, 7))} 月`;
  if (date.length >= 10) {
    return `${date.slice(0, 4)} 年 ${Number(date.slice(5, 7))} 月 ${Number(date.slice(8, 10))} 日`;
  }
  return date;
}

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const { title, date, category, description, role, url, tags, ongoing } = activity;
  const dateLabel = ongoing ? `${formatDate(date)} 〜 現在` : formatDate(date);

  return (
    <article className="flex h-full flex-col gap-16 rounded-comfortable bg-pure-white p-32 shadow-subtle-card transition-all duration-200 hover:-translate-y-4 hover:shadow-full-card">
      <div className="flex flex-wrap items-center gap-8">
        <time dateTime={date} className="font-geist-mono text-caption text-gray-500">
          {dateLabel}
        </time>
        <span
          className={`rounded-pill px-10 py-3 font-medium text-caption ${ACTIVITY_CATEGORY_BADGE_CLASS[category]}`}
        >
          {ACTIVITY_CATEGORY_LABEL[category]}
        </span>
        {role && (
          <span className="rounded-pill bg-badge-tool-bg px-10 py-3 font-medium text-badge-tool-text text-caption">
            {role}
          </span>
        )}
      </div>

      <h3 className="text-card-title-light text-vercel-black">{title}</h3>

      <p className="text-body-small text-gray-600">{description}</p>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-8">
          {tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="rounded-pill bg-badge-blue-bg px-10 py-3 font-medium text-badge-blue-text text-caption"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-button-link text-link-blue hover:underline"
        >
          詳しく見る →
        </a>
      )}
    </article>
  );
}
