import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface NextReadCard {
  // Restrict href to internal absolute paths (starting with /) to prevent
  // unsafe schemes like javascript: when this component is reused elsewhere.
  href: `/${string}`;
  title: string;
  description: string;
}

interface NextReadNavProps {
  cards: readonly NextReadCard[];
}

export function NextReadNav({ cards }: NextReadNavProps) {
  return (
    <ul className="grid gap-32 md:grid-cols-3">
      {cards.map((card) => (
        <li key={card.href}>
          <Link
            href={card.href}
            className="group flex h-full flex-col gap-12 rounded-comfortable bg-pure-white p-32 shadow-subtle-card transition-all duration-200 hover:-translate-y-4 hover:shadow-full-card"
          >
            <h3 className="text-card-title text-vercel-black">{card.title}</h3>
            <p className="text-body-small text-gray-600">{card.description}</p>
            <span className="mt-auto inline-flex items-center gap-4 font-medium text-button-link text-link-blue">
              詳しく見る
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
