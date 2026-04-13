import type { Skill } from '@/types';

export const skills: Skill[] = [
  // Cloud / IaC
  { name: 'AWS', category: 'cloud', level: 'expert', years: 3 },
  { name: 'Google Cloud', category: 'cloud', level: 'advanced', years: 1 },
  { name: 'Terraform', category: 'cloud', level: 'advanced', years: 2 },
  { name: 'Terragrunt', category: 'cloud', level: 'advanced', years: 1 },

  // Languages
  { name: 'Python', category: 'language', level: 'intermediate', years: 4 },
  { name: 'Shell Script', category: 'language', level: 'intermediate', years: 7 },
  { name: 'Perl', category: 'language', level: 'intermediate', years: 3 },
  { name: 'SQL', category: 'language', level: 'intermediate', years: 4 },
  { name: 'Ruby', category: 'language', level: 'intermediate', years: 2 },

  // Database
  { name: 'Aurora MySQL', category: 'database', level: 'advanced', years: 3 },
  { name: 'PostgreSQL', category: 'database', level: 'intermediate', years: 2 },
  { name: 'Redis / Valkey', category: 'database', level: 'intermediate', years: 3 },
  { name: 'TiDB', category: 'database', level: 'intermediate', years: 1 },
  { name: 'SQL Server', category: 'database', level: 'intermediate', years: 1 },

  // DevOps / Tools
  { name: 'Docker', category: 'tool', level: 'advanced', years: 4 },
  { name: 'Git / GitHub', category: 'tool', level: 'advanced', years: 7 },
  { name: 'Jenkins', category: 'tool', level: 'advanced', years: 2 },
  { name: 'Claude Code (AI)', category: 'tool', level: 'advanced', years: 1 },
  { name: 'Nginx', category: 'tool', level: 'intermediate', years: 3 },
  { name: 'Linux (CentOS/Ubuntu)', category: 'tool', level: 'intermediate', years: 7 },
];
