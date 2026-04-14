import Link from 'next/link';

interface HeroSectionProps {
  name: string;
  tagline: string;
  stats: { label: string; value: string }[];
}

export function HeroSection({ name, tagline, stats }: HeroSectionProps) {
  return (
    <section
      aria-label="ヒーロー"
      className="hero-gradient mx-auto flex max-w-[1200px] flex-col items-center px-16 py-40 text-center md:px-32"
    >
      <h1 className="text-display-hero text-vercel-black">{name}</h1>
      <p className="mt-16 text-body-large text-gray-600">{tagline}</p>
      <div className="mt-32 flex gap-16">
        <Link
          href="/projects/"
          className="inline-flex items-center rounded-standard bg-vercel-black px-16 py-10 text-button-link text-pure-white transition-all duration-200 hover:opacity-85 focus-visible:shadow-focus focus-visible:outline-none active:scale-[0.98]"
        >
          Side Projects を見る
        </Link>
        <Link
          href="/about/"
          className="inline-flex items-center rounded-standard bg-pure-white px-16 py-10 text-button-link text-vercel-black shadow-light-ring transition-all duration-200 hover:shadow-ring focus-visible:shadow-focus focus-visible:outline-none active:scale-[0.98]"
        >
          About を見る
        </Link>
      </div>
      {stats.length > 0 && (
        <dl className="mt-32 flex gap-16 md:gap-32">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <dt className="text-caption text-gray-500">{stat.label}</dt>
              <dd
                className="text-section-heading text-vercel-black"
                style={{ fontFeatureSettings: '"tnum"' }}
              >
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
