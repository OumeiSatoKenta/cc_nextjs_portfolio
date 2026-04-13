import Link from 'next/link';

interface HeroSectionProps {
  name: string;
  tagline: string;
}

export function HeroSection({ name, tagline }: HeroSectionProps) {
  return (
    <section
      aria-label="ヒーロー"
      className="mx-auto flex max-w-[1200px] flex-col items-center px-16 py-40 text-center md:px-32"
    >
      <h1 className="text-display-hero text-vercel-black">{name}</h1>
      <p className="mt-16 text-body-large text-gray-600">{tagline}</p>
      <Link
        href="/projects/"
        className="mt-32 inline-flex items-center rounded-standard bg-vercel-black px-16 py-10 text-button-link text-pure-white transition-opacity hover:opacity-85 focus-visible:shadow-focus focus-visible:outline-none"
      >
        Projects を見る
      </Link>
    </section>
  );
}
