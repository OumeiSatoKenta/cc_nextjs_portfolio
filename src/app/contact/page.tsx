import type { Metadata } from 'next';
import { SocialLinkCard } from '@/components/contact/SocialLinkCard';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';
import { socialLinks } from '@/data/social';

export const metadata: Metadata = {
  title: 'Contact',
  description: '各種SNS・プラットフォーム',
};

export default function ContactPage() {
  return (
    <>
      <section className="mx-auto max-w-[1200px] px-16 py-40 md:px-32" aria-label="コンタクト">
        <AnimateOnScroll>
          <h1 className="text-display-hero text-vercel-black">Contact</h1>
          <p className="mt-16 text-body-large text-gray-600">各種SNS・プラットフォーム</p>
        </AnimateOnScroll>
      </section>

      <section className="mx-auto max-w-[1200px] px-16 pb-40 md:px-32" aria-label="リンク一覧">
        <div className="grid gap-32 md:grid-cols-2">
          {socialLinks.map((link, index) => (
            <AnimateOnScroll key={link.url} delay={index * 100}>
              <SocialLinkCard
                platform={link.platform}
                url={link.url}
                icon={link.icon}
                label={link.label}
              />
            </AnimateOnScroll>
          ))}
        </div>
      </section>
    </>
  );
}
