import type { Skill, SkillCategory, SkillLevel } from '@/types';

interface SkillGridProps {
  skills: Skill[];
}

const CATEGORY_ORDER: SkillCategory[] = ['cloud', 'language', 'database', 'tool'];

const CATEGORY_LABEL: Record<SkillCategory, string> = {
  cloud: 'Cloud / IaC',
  language: 'Languages',
  database: 'Database',
  tool: 'DevOps / Tools',
};

const LEVEL_BADGE_CLASS: Record<NonNullable<SkillLevel>, string> = {
  expert: 'bg-vercel-black text-pure-white',
  advanced: 'bg-gray-100 text-vercel-black',
  intermediate: 'bg-badge-blue-bg text-badge-blue-text',
  beginner: 'bg-badge-blue-bg text-badge-blue-text',
};

export function SkillGrid({ skills }: SkillGridProps) {
  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABEL[category],
    items: skills.filter((s) => s.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="grid gap-32 md:grid-cols-2">
      {grouped.map((group) => (
        <div key={group.category}>
          <h3 className="text-card-title-light text-vercel-black">{group.label}</h3>
          <div className="mt-16 flex flex-wrap gap-8">
            {group.items.map((skill) => (
              <span
                key={skill.name}
                className={`rounded-pill px-10 py-3 font-medium text-caption ${LEVEL_BADGE_CLASS[skill.level ?? 'intermediate']}`}
              >
                {skill.name}
                {skill.years ? ` · ${skill.years}年` : ''}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
