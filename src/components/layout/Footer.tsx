import Link from 'next/link';
import { SocialIcon } from '@/components/icons/SocialIcon';
import { isExternalHttpUrl } from '@/lib/url';
import type { NavLink, SocialLink } from '@/types';

interface FooterProps {
  authorName: string;
  socialLinks: SocialLink[];
  siteName: string;
  siteDescription: string;
  navLinks: NavLink[];
}

export function Footer({
  authorName,
  socialLinks,
  siteName,
  siteDescription,
  navLinks,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="shadow-ring">
      <div className="mx-auto max-w-[1200px] px-16 py-40 md:px-32">
        <div className="grid gap-32 text-center md:grid-cols-3 md:text-left">
          <div>
            <p className="text-body-semibold text-vercel-black">{siteName}</p>
            <p className="mt-8 text-caption text-gray-500">{siteDescription}</p>
          </div>

          <nav aria-label="フッターナビゲーション">
            <ul className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-micro text-body-small text-gray-500 transition-colors hover:text-vercel-black focus-visible:shadow-focus focus-visible:outline-none"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ul aria-label="ソーシャルリンク" className="flex justify-center gap-16 md:justify-end">
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
                    <SocialIcon name={link.icon} size={20} />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-32 border-gray-100 border-t pt-32 text-center">
          <p className="text-caption text-gray-500">
            © {currentYear} {authorName}
          </p>
        </div>
      </div>
    </footer>
  );
}
