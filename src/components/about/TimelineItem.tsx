interface TimelineItemProps {
  company: string;
  role: string;
  period: { start: string; end?: string };
  description: string;
  achievements: string[];
  technologies?: string[];
  isLast: boolean;
}

function formatPeriod(period: { start: string; end?: string }): string {
  return period.end ? `${period.start} — ${period.end}` : `${period.start} — 現在`;
}

export function TimelineItem({
  company,
  role,
  period,
  description,
  achievements,
  technologies,
  isLast,
}: TimelineItemProps) {
  return (
    <article className="relative flex gap-32 pl-32">
      <div className="absolute left-0 top-0 flex h-full flex-col items-center">
        <div className="h-3 w-3 shrink-0 rounded-circle bg-vercel-black" aria-hidden="true" />
        {!isLast && <div className="w-1 flex-1 bg-gray-100" aria-hidden="true" />}
      </div>

      <div className="flex flex-col gap-8 pb-40">
        <h3 className="text-card-title text-vercel-black">{company}</h3>
        <time
          dateTime={period.end ?? period.start}
          className="font-geist-mono text-caption font-medium uppercase text-gray-500"
        >
          {formatPeriod(period)}
        </time>
        <p className="text-body-medium text-gray-600">{role}</p>
        <p className="text-body-small text-gray-600">{description}</p>

        {achievements.length > 0 && (
          <ul className="flex flex-col gap-4 pl-16">
            {achievements.map((achievement, index) => (
              <li key={`${index}-${achievement}`} className="list-disc text-body-small text-gray-600">
                {achievement}
              </li>
            ))}
          </ul>
        )}

        {technologies && technologies.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-6">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-pill bg-badge-blue-bg px-10 py-3 text-caption font-medium text-badge-blue-text"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
