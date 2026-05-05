import type { Skill } from '@/types';

interface SkillsPreviewProps {
  skills: Skill[];
}

const LEVEL_BADGE_CLASS: Record<'expert' | 'advanced', string> = {
  expert: 'bg-badge-cloud-bg text-badge-cloud-text',
  advanced: 'bg-badge-tool-bg text-badge-tool-text',
};

type FeaturedSkill = Skill & { level: 'expert' | 'advanced' };

export function SkillsPreview({ skills }: SkillsPreviewProps) {
  const top = skills.filter(
    (s): s is FeaturedSkill => s.level === 'expert' || s.level === 'advanced'
  );

  return (
    <ul className="flex flex-wrap gap-12">
      {top.map((skill) => (
        <li key={skill.name}>
          <span
            className={`rounded-pill px-10 py-3 font-medium text-caption ${LEVEL_BADGE_CLASS[skill.level]}`}
          >
            {skill.name}
          </span>
        </li>
      ))}
    </ul>
  );
}
