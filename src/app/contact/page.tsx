import type { Metadata } from 'next';
import { SocialLinkCard } from '@/components/contact/SocialLinkCard';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';
import { socialLinks } from '@/data/social';

export const metadata: Metadata = {
  title: 'Contact',
  description: '各種SNS・プラットフォーム',
};

const mailLink = socialLinks.find((link) => link.platform === 'Mail');
const linkedinLink = socialLinks.find((link) => link.platform === 'LinkedIn');
const otherLinks = socialLinks.filter(
  (link) => link.platform !== 'Mail' && link.platform !== 'LinkedIn',
);

export default function ContactPage() {
  return (
    <>
      <section className="mx-auto max-w-[1200px] px-16 py-40 md:px-32" aria-label="コンタクト">
        <AnimateOnScroll>
          <h1 className="text-display-hero text-vercel-black">Contact</h1>
          <p className="mt-16 text-body-large text-gray-600">各種SNS・プラットフォーム</p>
        </AnimateOnScroll>
      </section>

      <section className="mx-auto max-w-[1200px] px-16 pb-40 md:px-32" aria-label="お問い合わせ">
        <AnimateOnScroll>
          <div className="rounded-image bg-pure-white p-32 shadow-subtle-card">
            <h2 className="text-sub-heading-large text-vercel-black">お気軽にご連絡ください</h2>
            <p className="mt-16 text-body-small text-gray-600">
              SRE・クラウドインフラ・AI
              駆動開発に関するご相談、技術コミュニティでのコラボレーション、登壇・執筆のご依頼など、お気軽にお問い合わせください。
            </p>
            <div className="mt-32 flex flex-wrap gap-16">
              {mailLink && (
                <a
                  href={mailLink.url}
                  className="inline-flex items-center rounded-standard bg-vercel-black px-16 py-10 text-button-link text-pure-white transition-all duration-200 hover:opacity-85 focus-visible:shadow-focus focus-visible:outline-none active:scale-[0.98]"
                >
                  メールを送る
                </a>
              )}
              {linkedinLink && (
                <a
                  href={linkedinLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-standard bg-pure-white px-16 py-10 text-button-link text-vercel-black shadow-light-ring transition-all duration-200 hover:shadow-ring focus-visible:shadow-focus focus-visible:outline-none active:scale-[0.98]"
                >
                  LinkedIn →
                </a>
              )}
            </div>
            <p className="mt-16 text-button-small text-gray-400">
              返信は通常 1〜2 営業日以内にお送りします
            </p>
          </div>
        </AnimateOnScroll>
      </section>

      <section className="mx-auto max-w-[1200px] px-16 pb-40 md:px-32" aria-label="リンク一覧">
        <div className="grid gap-32 md:grid-cols-2">
          {otherLinks.map((link, index) => (
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
