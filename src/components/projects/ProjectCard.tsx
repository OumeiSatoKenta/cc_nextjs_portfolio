interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  highlights?: string[];
  metrics?: { label: string; value: string }[];
  linkLabel?: string;
}

export function ProjectCard({
  title,
  description,
  technologies,
  githubUrl,
  liveUrl,
  highlights,
  metrics,
  linkLabel,
}: ProjectCardProps) {
  return (
    <article className="flex h-full flex-col gap-16 rounded-comfortable bg-pure-white p-32 shadow-subtle-card transition-all duration-200 hover:-translate-y-4 hover:shadow-full-card">
      <h3 className="text-card-title text-vercel-black">{title}</h3>
      <p className="text-body-small text-gray-600">{description}</p>

      {highlights && highlights.length > 0 && (
        <ul className="flex flex-col gap-4 pl-16">
          {highlights.map((highlight, index) => (
            <li key={`${index}-${highlight}`} className="list-disc text-body-small text-gray-600">
              {highlight}
            </li>
          ))}
        </ul>
      )}

      {metrics && metrics.length > 0 && (
        <dl className="flex gap-32">
          {metrics.map((metric) => (
            <div key={metric.label} className="flex flex-col-reverse text-center">
              <dt className="font-medium text-caption text-gray-400">{metric.label}</dt>
              <dd
                className="text-sub-heading-large text-vercel-black"
                style={{ fontFeatureSettings: '"tnum"' }}
              >
                {metric.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {technologies.length > 0 && (
        <div className="flex flex-wrap gap-8">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-pill bg-badge-blue-bg px-10 py-3 font-medium text-badge-blue-text text-caption"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {(githubUrl || liveUrl) && (
        <div className="flex gap-16">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-button-link text-link-blue hover:underline"
            >
              GitHub →
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-button-link text-link-blue hover:underline"
            >
              {linkLabel ?? 'Live'} →
            </a>
          )}
        </div>
      )}
    </article>
  );
}
