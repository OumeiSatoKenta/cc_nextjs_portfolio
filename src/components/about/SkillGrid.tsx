import {
  Boxes,
  Cloud,
  Code,
  Container,
  Database,
  Gem,
  GitBranch,
  type LucideIcon,
  Monitor,
  Server,
  Sparkles,
  Terminal,
  Workflow,
  Zap,
} from 'lucide-react';
import type { Skill, SkillCategory, SkillLevel } from '@/types';

const ICON_MAP: Record<string, LucideIcon> = {
  Boxes,
  Cloud,
  Code,
  Container,
  Database,
  Gem,
  GitBranch,
  Monitor,
  Server,
  Sparkles,
  Terminal,
  Workflow,
  Zap,
};

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

const STRONG_LEVELS: SkillLevel[] = ['expert', 'advanced'];

function isStrongSkill(skill: Skill): boolean {
  return skill.level !== undefined && STRONG_LEVELS.includes(skill.level);
}

interface SkillGridProps {
  skills: Skill[];
}

export function SkillGrid({ skills }: SkillGridProps) {
  const strong = skills.filter(isStrongSkill);
  const growing = skills.filter((s) => !isStrongSkill(s));

  return (
    <div className="flex flex-col gap-32">
      <SkillGroup label="得意領域" skills={strong} />
      <SkillGroup label="成長中" skills={growing} />
    </div>
  );
}

interface SkillGroupProps {
  label: string;
  skills: Skill[];
}

function SkillGroup({ label, skills }: SkillGroupProps) {
  if (skills.length === 0) return null;

  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABEL[category],
    items: skills.filter((s) => s.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <div>
      <h3 className="text-sub-heading-large text-vercel-black">{label}</h3>
      <div className="mt-16 grid gap-32 md:grid-cols-2">
        {grouped.map((group) => (
          <div key={group.category}>
            <h4 className="text-card-title-light text-vercel-black">{group.label}</h4>
            <ul className="mt-12 flex flex-col gap-8">
              {group.items.map((skill) => (
                <SkillChip key={skill.name} skill={skill} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

interface SkillChipProps {
  skill: Skill;
}

function SkillChip({ skill }: SkillChipProps) {
  const Icon = skill.icon ? ICON_MAP[skill.icon] : undefined;
  const badgeClass =
    skill.level === 'expert'
      ? 'bg-vercel-black text-pure-white'
      : CATEGORY_BADGE_CLASS[skill.category];
  const label = skill.years ? `${skill.name} · ${skill.years}年` : skill.name;

  return (
    <li className="flex flex-col gap-4">
      <span
        className={`inline-flex items-center gap-6 self-start rounded-pill px-10 py-3 font-medium text-caption ${badgeClass}`}
      >
        {Icon && <Icon size={14} aria-hidden="true" />}
        <span>{label}</span>
      </span>
      {skill.description && <p className="pl-4 text-caption text-gray-500">{skill.description}</p>}
    </li>
  );
}
