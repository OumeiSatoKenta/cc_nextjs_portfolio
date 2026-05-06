import type { Metadata } from 'next';
import { SocialLinkCard } from '@/components/contact/SocialLinkCard';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';
import { socialLinks } from '@/data/social';

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description: '各種SNS・プラットフォーム',
};

const linkedinLink = socialLinks.find((link) => link.platform === 'LinkedIn');
const otherLinks = socialLinks.filter((link) => link.platform !== 'LinkedIn');

export default function ContactPage() {
  return (
    <>
      <section className="mx-auto max-w-[1200px] px-16 py-40 md:px-32" aria-label="コンタクト">
        <AnimateOnScroll>
          <h1 className="text-display-hero text-vercel-black">お問い合わせ</h1>
          <p className="mt-16 text-body-large text-gray-600">各種SNS・プラットフォーム</p>
        </AnimateOnScroll>
      </section>

      <section className="mx-auto max-w-[1200px] px-16 pb-40 md:px-32" aria-label="お問い合わせ">
        <AnimateOnScroll>
          <div className="rounded-image bg-pure-white p-32 shadow-subtle-card">
            <h2 className="text-sub-heading-large text-vercel-black">お気軽にご連絡ください</h2>
            <p className="mt-16 text-body-small text-gray-600">
              SRE・クラウドインフラ・AI
              駆動開発に関するご相談、技術コミュニティでのコラボレーション、登壇・執筆のご依頼などは
              LinkedIn メッセージにてご連絡ください。
            </p>
            <div className="mt-32 flex flex-wrap gap-16">
              {linkedinLink && (
                <a
                  href={linkedinLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-standard bg-vercel-black px-16 py-10 text-button-link text-pure-white transition-all duration-200 hover:opacity-85 focus-visible:shadow-focus focus-visible:outline-none active:scale-[0.98]"
                >
                  LinkedIn でメッセージを送る →
                </a>
              )}
            </div>
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
