import { SocialIcon } from '@/components/icons/SocialIcon';
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
    <article className="flex flex-col gap-16 rounded-comfortable bg-pure-white p-32 shadow-subtle-card transition hover:-translate-y-4 hover:shadow-full-card">
      <SocialIcon name={icon} size={32} className="text-gray-600" />
      <h3 className="text-body-medium text-vercel-black">{displayName}</h3>
      <a
        href={url}
        target="_blank"
        rel={external ? 'noopener noreferrer' : undefined}
        className="font-medium text-button-link text-link-blue hover:underline"
      >
        {displayName} →
      </a>
    </article>
  );
}
