import { Users } from 'lucide-react';
import type { CareerEngagement, CareerRoleType, EngagementType } from '@/types';

const ROLE_TYPE_LABEL: Record<CareerRoleType, string> = {
  design: '設計',
  implementation: '実装',
  management: 'マネジメント',
  operations: '運用',
};

const ROLE_TYPE_BADGE_CLASS: Record<CareerRoleType, string> = {
  design: 'bg-badge-cloud-bg text-badge-cloud-text',
  implementation: 'bg-badge-lang-bg text-badge-lang-text',
  management: 'bg-badge-db-bg text-badge-db-text',
  operations: 'bg-badge-tool-bg text-badge-tool-text',
};

const ENGAGEMENT_LABEL: Record<EngagementType, string> = {
  'in-house': '自社開発',
  ses: 'SES',
};

const ENGAGEMENT_BADGE_CLASS: Record<EngagementType, string> = {
  'in-house': 'bg-vercel-black text-pure-white',
  ses: 'bg-badge-blue-bg text-badge-blue-text',
};

function formatPeriod(period: { start: string; end?: string }): string {
  return period.end ? `${period.start} — ${period.end}` : `${period.start} — 現在`;
}

interface EngagementItemProps {
  engagement: CareerEngagement;
  isLast: boolean;
}

export function EngagementItem({ engagement, isLast }: EngagementItemProps) {
  const {
    client,
    engagementType,
    role,
    period,
    description,
    achievements,
    technologies,
    teamSize,
    roleType,
  } = engagement;
  const hasRoleMeta = teamSize !== undefined || (roleType && roleType.length > 0);

  return (
    <article className="relative flex gap-24 pl-24">
      <div className="absolute top-0 left-0 flex h-full flex-col items-center">
        <div className="mt-3 h-2 w-2 shrink-0 rounded-circle bg-gray-500" aria-hidden="true" />
        {!isLast && <div className="w-0.5 flex-1 bg-gray-100" aria-hidden="true" />}
      </div>

      <div className="flex flex-col gap-8 pb-32">
        <div className="flex flex-wrap items-center gap-8">
          <h4 className="text-card-title-light text-vercel-black">{client}</h4>
          <span
            className={`rounded-pill px-10 py-3 font-medium text-caption ${ENGAGEMENT_BADGE_CLASS[engagementType]}`}
          >
            {ENGAGEMENT_LABEL[engagementType]}
          </span>
        </div>
        <time
          dateTime={period.end ?? period.start}
          className="font-geist-mono font-medium text-caption text-gray-500 uppercase"
        >
          {formatPeriod(period)}
        </time>
        <p className="text-body-medium text-gray-600">{role}</p>

        {hasRoleMeta && (
          <ul className="flex flex-wrap items-center gap-8" aria-label="チーム規模・役割種別">
            {teamSize !== undefined && (
              <li className="inline-flex items-center gap-4 rounded-pill bg-badge-tool-bg px-10 py-3 font-medium text-badge-tool-text text-caption">
                <Users size={14} aria-hidden="true" />
                <span>チーム {teamSize}人</span>
              </li>
            )}
            {roleType?.map((type) => (
              <li
                key={type}
                className={`rounded-pill px-10 py-3 font-medium text-caption ${ROLE_TYPE_BADGE_CLASS[type]}`}
              >
                {ROLE_TYPE_LABEL[type]}
              </li>
            ))}
          </ul>
        )}

        <p className="text-body-small text-gray-600">{description}</p>

        {achievements.length > 0 && (
          <ul className="flex flex-col gap-4 pl-16">
            {achievements.map((achievement, index) => (
              <li
                key={`${index}-${achievement}`}
                className="list-disc text-body-small text-gray-600"
              >
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
                className="rounded-pill bg-badge-blue-bg px-10 py-3 font-medium text-badge-blue-text text-caption"
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
