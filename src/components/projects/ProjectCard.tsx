import { TrendingUp, User, Users } from 'lucide-react';
import type { ProjectThumbnail as ProjectThumbnailType } from '@/types';
import { ProjectThumbnail } from './ProjectThumbnail';

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  highlights?: string[];
  metrics?: { label: string; value: string }[];
  linkLabel?: string;
  thumbnail?: ProjectThumbnailType;
  teamSize?: number;
  role?: string;
  userCount?: string;
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
  thumbnail,
  teamSize,
  role,
  userCount,
}: ProjectCardProps) {
  const hasMeta = teamSize !== undefined || Boolean(role) || Boolean(userCount);

  return (
    <article className="flex h-full flex-col gap-16 overflow-hidden rounded-image bg-pure-white p-32 shadow-subtle-card transition-all duration-200 hover:-translate-y-4 hover:shadow-full-card">
      {thumbnail && (
        <div className="-mx-32 -mt-32 mb-0">
          <ProjectThumbnail
            accentColor={thumbnail.accentColor}
            icon={thumbnail.icon}
            image={thumbnail.image}
            fit={thumbnail.fit}
            background={thumbnail.background}
          />
        </div>
      )}
      <h3 className="text-card-title text-vercel-black">{title}</h3>
      <p className="text-body-small text-gray-600">{description}</p>

      {hasMeta && (
        <ul className="flex flex-wrap gap-8" aria-label="プロジェクト詳細">
          {teamSize !== undefined && (
            <li className="inline-flex items-center gap-4 rounded-pill bg-badge-tool-bg px-10 py-3 font-medium text-badge-tool-text text-caption">
              <Users size={14} aria-hidden="true" />
              <span>チーム {teamSize}人</span>
            </li>
          )}
          {role && (
            <li className="inline-flex items-center gap-4 rounded-pill bg-badge-tool-bg px-10 py-3 font-medium text-badge-tool-text text-caption">
              <User size={14} aria-hidden="true" />
              <span>役割: {role}</span>
            </li>
          )}
          {userCount && (
            <li className="inline-flex items-center gap-4 rounded-pill bg-badge-tool-bg px-10 py-3 font-medium text-badge-tool-text text-caption">
              <TrendingUp size={14} aria-hidden="true" />
              <span>{userCount}</span>
            </li>
          )}
        </ul>
      )}

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
