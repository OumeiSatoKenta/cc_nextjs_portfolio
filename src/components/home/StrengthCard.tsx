import type { Strength } from '@/types';

type AccentColor = Strength['accentColor'];

interface StrengthCardProps {
  title: string;
  description: string;
  accentColor: AccentColor;
}

const ACCENT_BAR_CLASS: Record<AccentColor, string> = {
  ship: 'bg-ship-red',
  preview: 'bg-preview-pink',
  develop: 'bg-develop-blue',
};

export function StrengthCard({ title, description, accentColor }: StrengthCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-comfortable bg-pure-white shadow-subtle-card">
      <div className={`h-4 ${ACCENT_BAR_CLASS[accentColor]}`} aria-hidden="true" />
      <div className="flex flex-col gap-12 p-32">
        <h3 className="text-card-title text-vercel-black">{title}</h3>
        <p className="text-body-small text-gray-600">{description}</p>
      </div>
    </article>
  );
}
