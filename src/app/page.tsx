import { HeroSection } from '@/components/home/HeroSection';
import { StrengthCard } from '@/components/home/StrengthCard';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';
import { siteMetadata } from '@/data/metadata';

export default function HomePage() {
  const { author } = siteMetadata;

  return (
    <>
      <AnimateOnScroll>
        <HeroSection name={author.name} tagline={author.tagline} stats={author.stats} />
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
    </>
  );
}
