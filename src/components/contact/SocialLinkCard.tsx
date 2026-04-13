import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import { isExternalHttpUrl } from '@/lib/url';

interface SocialLinkCardProps {
  platform: string;
  url: string;
  icon: string;
  label?: string;
}

export function SocialLinkCard({ platform, url, icon, label }: SocialLinkCardProps) {
  const external = isExternalHttpUrl(url);
  const displayName = label ?? platform;

  return (
    <article className="flex flex-col gap-16 rounded-comfortable bg-pure-white p-32 shadow-subtle-card transition-shadow hover:shadow-full-card">
      <DynamicIcon name={icon as IconName} size={32} className="text-gray-600" aria-hidden="true" />
      <h3 className="text-body-medium text-vercel-black">{displayName}</h3>
      <a
        href={url}
        target="_blank"
        rel={external ? 'noopener noreferrer' : undefined}
        className="text-button-link font-medium text-link-blue hover:underline"
      >
        {displayName} →
      </a>
    </article>
  );
}
