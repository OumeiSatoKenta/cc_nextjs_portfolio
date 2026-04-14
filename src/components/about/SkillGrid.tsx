import type { Skill, SkillCategory } from '@/types';

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

const CATEGORY_BADGE_CLASS: Record<SkillCategory, string> = {
  cloud: 'bg-badge-cloud-bg text-badge-cloud-text',
  language: 'bg-badge-lang-bg text-badge-lang-text',
  database: 'bg-badge-db-bg text-badge-db-text',
  tool: 'bg-badge-tool-bg text-badge-tool-text',
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
                className={`rounded-pill px-10 py-3 font-medium text-caption ${skill.level === 'expert' ? 'bg-vercel-black text-pure-white' : CATEGORY_BADGE_CLASS[skill.category]}`}
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
