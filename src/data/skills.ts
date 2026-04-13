import { Skill } from '@/types';

export const skills: Skill[] = [
  // Cloud / IaC
  { name: 'AWS', category: 'cloud', level: 'expert' },
  { name: 'Google Cloud', category: 'cloud', level: 'advanced' },
  { name: 'Terraform', category: 'cloud', level: 'advanced' },
  { name: 'Terragrunt', category: 'cloud', level: 'advanced' },

  // Languages
  { name: 'Python', category: 'language', level: 'intermediate' },
  { name: 'Shell Script', category: 'language', level: 'intermediate' },
  { name: 'Perl', category: 'language', level: 'intermediate' },
  { name: 'SQL', category: 'language', level: 'intermediate' },
  { name: 'Ruby', category: 'language', level: 'intermediate' },

  // Database
  { name: 'Aurora MySQL', category: 'database', level: 'advanced' },
  { name: 'PostgreSQL', category: 'database', level: 'intermediate' },
  { name: 'Redis / Valkey', category: 'database', level: 'intermediate' },
  { name: 'TiDB', category: 'database', level: 'intermediate' },
  { name: 'SQL Server', category: 'database', level: 'intermediate' },

  // DevOps / Tools
  { name: 'Docker', category: 'tool', level: 'advanced' },
  { name: 'Git / GitHub', category: 'tool', level: 'advanced' },
  { name: 'Jenkins', category: 'tool', level: 'advanced' },
  { name: 'Claude Code (AI)', category: 'tool', level: 'advanced' },
  { name: 'Nginx', category: 'tool', level: 'intermediate' },
  { name: 'Linux (CentOS/Ubuntu)', category: 'tool', level: 'intermediate' },
];
