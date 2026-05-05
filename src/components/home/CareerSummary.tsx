import type { CareerOverview } from '@/types';

interface CareerSummaryProps {
  careers: CareerOverview[];
  limit?: number;
}

function formatPeriod(period: CareerOverview['period']): string {
  const end = period.end ?? '現在';
  return `${period.start} – ${end}`;
}

export function CareerSummary({ careers, limit = 3 }: CareerSummaryProps) {
  const items = careers.slice(0, limit);

  return (
    <ul className="flex flex-col gap-16">
      {items.map((career) => (
        <li
          key={`${career.company}-${career.period.start}`}
          className="flex flex-col gap-8 rounded-comfortable bg-pure-white p-16 shadow-subtle-card md:flex-row md:items-center md:justify-between"
        >
          <div className="flex flex-col gap-4">
            <h3 className="text-card-title-light text-vercel-black">{career.company}</h3>
            <p className="text-body-small text-gray-600">{career.role}</p>
          </div>
          <time
            dateTime={
              career.period.end
                ? `${career.period.start}/${career.period.end}`
                : career.period.start
            }
            className="font-geist-mono text-caption text-gray-500"
          >
            {formatPeriod(career.period)}
          </time>
        </li>
      ))}
    </ul>
  );
}
