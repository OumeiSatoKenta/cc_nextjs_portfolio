import type { BlogPlatform } from '@/types';

const PLATFORM_LABEL: Record<BlogPlatform, string> = {
  zenn: 'Zenn',
  qiita: 'Qiita',
  note: 'note',
  amazon: 'Amazon Kindle',
  other: 'Other',
};

interface BlogCardProps {
  title: string;
  url: string;
  publishedAt: string;
  platform: BlogPlatform;
  description?: string;
  tags?: string[];
}

export function BlogCard({ title, url, publishedAt, platform, description, tags }: BlogCardProps) {
  return (
    <article className="flex flex-col gap-16 rounded-comfortable bg-pure-white p-32 shadow-subtle-card transition-shadow hover:shadow-full-card">
      <div className="flex items-center gap-8">
        <time dateTime={publishedAt} className="font-geist-mono text-caption text-gray-500">
          {new Intl.DateTimeFormat('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }).format(new Date(publishedAt))}
        </time>
        <span className="rounded-pill bg-badge-blue-bg px-10 py-3 font-medium text-badge-blue-text text-caption">
          {PLATFORM_LABEL[platform]}
        </span>
      </div>

      <h3 className="text-card-title-light text-vercel-black">{title}</h3>

      {description && <p className="text-body-small text-gray-600">{description}</p>}

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

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-button-link text-link-blue hover:underline"
      >
        {PLATFORM_LABEL[platform]}で読む →
      </a>
    </article>
  );
}
