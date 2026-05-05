import Link from 'next/link';
import type { ReactNode } from 'react';

interface SectionPreviewProps {
  title: string;
  ariaLabel: string;
  href: string;
  linkLabel: string;
  children: ReactNode;
}

export function SectionPreview({
  title,
  ariaLabel,
  href,
  linkLabel,
  children,
}: SectionPreviewProps) {
  return (
    <section className="mx-auto max-w-[1200px] px-16 pb-40 md:px-32" aria-label={ariaLabel}>
      <div className="flex items-end justify-between gap-16">
        <h2 className="text-section-heading text-vercel-black">{title}</h2>
        <Link href={href} className="font-medium text-button-link text-link-blue hover:underline">
          {linkLabel} →
        </Link>
      </div>
      <div className="mt-32">{children}</div>
    </section>
  );
}
