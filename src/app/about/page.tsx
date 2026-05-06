import type { Metadata } from 'next';
import { EducationAccordion } from '@/components/about/EducationAccordion';
import { EducationHero } from '@/components/about/EducationHero';
import { NextReadNav } from '@/components/about/NextReadNav';
import { PersonalInfoSection } from '@/components/about/PersonalInfoSection';
import { SkillGrid } from '@/components/about/SkillGrid';
import { StickyNav } from '@/components/about/StickyNav';
import { Timeline } from '@/components/about/Timeline';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';
import { careers } from '@/data/career';
import { educationHero, educations } from '@/data/education';
import { siteMetadata } from '@/data/metadata';
import { skills } from '@/data/skills';

export const metadata: Metadata = {
  title: '経歴・スキル',
  description: '経歴とスキルセット',
};

const NEXT_READ_CARDS = [
  {
    href: '/projects/',
    title: 'サイドプロジェクト',
    description: '個人開発・技術書・コミュニティ活動の一覧',
  },
  { href: '/blog/', title: 'ブログ', description: '技術記事・執筆活動' },
  { href: '/contact/', title: 'お問い合わせ', description: 'メール・LinkedIn での連絡先' },
] as const;

export default function AboutPage() {
  const { author } = siteMetadata;

  // Build nav items dynamically so optional sections (education / personal) don't
  // appear in the nav when their corresponding sections aren't rendered.
  const navItems = [
    { id: 'intro', label: 'イントロ' },
    { id: 'career', label: 'キャリア' },
    { id: 'skills', label: 'スキル' },
    ...(educations.length > 0 ? [{ id: 'education', label: '学歴・学術研究' }] : []),
    ...(author.personalInfo ? [{ id: 'personal', label: 'パーソナル' }] : []),
  ];

  return (
    <>
      <section className="bg-pure-white" aria-label="経歴">
        <div className="mx-auto max-w-[1200px] px-16 py-40 md:px-32">
          <AnimateOnScroll>
            <h1 className="text-display-hero text-vercel-black">経歴・スキル</h1>
            <p className="mt-16 text-body-large text-gray-600">経歴とスキルセット</p>
          </AnimateOnScroll>
        </div>
      </section>

      <StickyNav items={navItems} />

      <section id="intro" className="bg-pure-white" aria-label="自己紹介">
        <div className="mx-auto max-w-[1200px] px-16 py-40 md:px-32">
          <AnimateOnScroll>
            <h2 className="text-section-heading text-vercel-black">自己紹介</h2>
            <div className="mt-16 flex flex-col gap-16">
              {author.introduction
                .split('\n\n')
                .filter(Boolean)
                .map((paragraph) => (
                  <p key={paragraph} className="text-body-large text-gray-600">
                    {paragraph}
                  </p>
                ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <section id="career" className="bg-gray-50" aria-label="職務経歴">
        <div className="mx-auto max-w-[1200px] px-16 py-40 md:px-32">
          <AnimateOnScroll>
            <h2 className="text-section-heading text-vercel-black">経歴</h2>
          </AnimateOnScroll>
          <AnimateOnScroll className="mt-32">
            <Timeline careers={careers} />
          </AnimateOnScroll>
        </div>
      </section>

      <section id="skills" className="bg-pure-white" aria-label="スキル">
        <div className="mx-auto max-w-[1200px] px-16 py-40 md:px-32">
          <AnimateOnScroll>
            <h2 className="text-section-heading text-vercel-black">スキル</h2>
          </AnimateOnScroll>
          <AnimateOnScroll className="mt-32">
            <SkillGrid skills={skills} />
          </AnimateOnScroll>
        </div>
      </section>

      {educations.length > 0 && (
        <section id="education" className="bg-gray-50" aria-label="学歴・学術研究">
          <div className="mx-auto max-w-[1200px] px-16 py-40 md:px-32">
            <AnimateOnScroll>
              <h2 className="text-section-heading text-vercel-black">学歴・学術研究</h2>
            </AnimateOnScroll>
            {educationHero.length > 0 && (
              <AnimateOnScroll className="mt-32">
                <EducationHero images={educationHero} />
              </AnimateOnScroll>
            )}
            <AnimateOnScroll className="mt-32">
              <EducationAccordion educations={educations} />
            </AnimateOnScroll>
          </div>
        </section>
      )}

      {author.personalInfo && (
        <section id="personal" className="bg-pure-white" aria-label="パーソナル情報">
          <div className="mx-auto max-w-[1200px] px-16 py-40 md:px-32">
            <AnimateOnScroll>
              <h2 className="text-section-heading text-vercel-black">パーソナル</h2>
            </AnimateOnScroll>
            <AnimateOnScroll className="mt-32">
              <PersonalInfoSection info={author.personalInfo} />
            </AnimateOnScroll>
          </div>
        </section>
      )}

      <section className="bg-gray-50" aria-label="次に読む">
        <div className="mx-auto max-w-[1200px] px-16 py-40 md:px-32">
          <AnimateOnScroll>
            <h2 className="text-section-heading text-vercel-black">次に読む</h2>
            <p className="mt-16 text-body-small text-gray-600">他のセクションへ</p>
          </AnimateOnScroll>
          <AnimateOnScroll className="mt-32">
            <NextReadNav cards={NEXT_READ_CARDS} />
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
