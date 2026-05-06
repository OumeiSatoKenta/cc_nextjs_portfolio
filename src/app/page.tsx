import { ActivityPreview } from '@/components/home/ActivityPreview';
import { CareerSummary } from '@/components/home/CareerSummary';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { HeroSection } from '@/components/home/HeroSection';
import { LatestBlog } from '@/components/home/LatestBlog';
import { PersonalInfoPreview } from '@/components/home/PersonalInfoPreview';
import { SectionPreview } from '@/components/home/SectionPreview';
import { SkillsPreview } from '@/components/home/SkillsPreview';
import { StrengthCard } from '@/components/home/StrengthCard';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';
import { activities } from '@/data/activities';
import { blogPosts } from '@/data/blog';
import { careerOverview } from '@/data/career';
import { siteMetadata } from '@/data/metadata';
import { projects } from '@/data/projects';
import { skills } from '@/data/skills';

export default function HomePage() {
  const { author } = siteMetadata;

  return (
    <>
      <AnimateOnScroll>
        <HeroSection name={author.name} tagline={author.tagline} stats={author.stats} />
      </AnimateOnScroll>

      <AnimateOnScroll>
        <SectionPreview title="経歴" ariaLabel="経歴" href="/about/" linkLabel="経歴を詳しく見る">
          <CareerSummary careers={careerOverview} />
        </SectionPreview>
      </AnimateOnScroll>

      <section className="mx-auto max-w-[1200px] px-16 pb-40 md:px-32" aria-label="強み">
        <ul className="grid gap-32 md:grid-cols-2 lg:grid-cols-3">
          {author.strengths.map((strength, index) => (
            <li key={strength.title}>
              <AnimateOnScroll delay={index * 100}>
                <StrengthCard
                  title={strength.title}
                  description={strength.description}
                  accentColor={strength.accentColor}
                />
              </AnimateOnScroll>
            </li>
          ))}
        </ul>
      </section>

      <AnimateOnScroll>
        <SectionPreview
          title="スキル"
          ariaLabel="スキルプレビュー"
          href="/about/"
          linkLabel="スキルを詳しく見る"
        >
          <SkillsPreview skills={skills} />
        </SectionPreview>
      </AnimateOnScroll>

      <AnimateOnScroll>
        <SectionPreview
          title="注目プロジェクト"
          ariaLabel="注目プロジェクト"
          href="/projects/"
          linkLabel="すべてのプロジェクトを見る"
        >
          <FeaturedProjects projects={projects} />
        </SectionPreview>
      </AnimateOnScroll>

      <AnimateOnScroll>
        <SectionPreview
          title="最新の記事"
          ariaLabel="最新ブログ"
          href="/blog/"
          linkLabel="すべての記事を見る"
        >
          <LatestBlog posts={blogPosts} />
        </SectionPreview>
      </AnimateOnScroll>

      <AnimateOnScroll>
        <SectionPreview
          title="活動履歴"
          ariaLabel="活動プレビュー"
          href="/activity/"
          linkLabel="すべての活動を見る"
        >
          <ActivityPreview activities={activities} />
        </SectionPreview>
      </AnimateOnScroll>

      {author.personalInfo && (
        <AnimateOnScroll>
          <SectionPreview
            title="パーソナル"
            ariaLabel="パーソナル情報"
            href="/about/#personal"
            linkLabel="詳細を見る"
          >
            <PersonalInfoPreview info={author.personalInfo} />
          </SectionPreview>
        </AnimateOnScroll>
      )}
    </>
  );
}
