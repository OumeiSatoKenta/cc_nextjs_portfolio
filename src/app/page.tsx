import { HeroSection } from '@/components/home/HeroSection';
import { StrengthCard } from '@/components/home/StrengthCard';
import { siteMetadata } from '@/data/metadata';

export default function HomePage() {
  const { author } = siteMetadata;

  return (
    <>
      <HeroSection name={author.name} tagline={author.tagline} />
      <section className="mx-auto max-w-[1200px] px-16 pb-40 md:px-32" aria-label="強み">
        <ul className="grid gap-32 md:grid-cols-2 lg:grid-cols-3">
          {author.strengths.map((strength) => (
            <li key={strength.title}>
              <StrengthCard
                title={strength.title}
                description={strength.description}
                accentColor={strength.accentColor}
              />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
