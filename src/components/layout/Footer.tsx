import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import { isExternalHttpUrl } from '@/lib/url';
import type { SocialLink } from '@/types';

interface FooterProps {
  authorName: string;
  socialLinks: SocialLink[];
}

export function Footer({ authorName, socialLinks }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="shadow-ring">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-16 px-16 py-32 md:flex-row">
        <p className="text-caption text-gray-500">
          © {currentYear} {authorName}
        </p>

        <ul className="flex gap-16">
          {socialLinks.map((link) => {
            const external = isExternalHttpUrl(link.url);
            return (
              <li key={link.platform}>
                <a
                  href={link.url}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="inline-flex items-center justify-center rounded-circle p-8 text-gray-500 transition-colors hover:text-vercel-black focus-visible:shadow-focus focus-visible:outline-none"
                  aria-label={link.label ?? link.platform}
                >
                  <DynamicIcon name={link.icon as IconName} size={20} />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
}
