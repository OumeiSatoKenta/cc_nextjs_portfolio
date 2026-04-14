export interface SiteMetadata {
  name: string;
  title: string;
  description: string;
  url: string;
  ogImage: string;
  author: {
    name: string;
    tagline: string;
    strengths: Strength[];
    stats: { label: string; value: string }[];
    introduction: string;
  };
}

export interface Strength {
  title: string;
  description: string;
  accentColor: 'ship' | 'preview' | 'develop';
}

/**
 * Social link metadata. `icon` is a free-form string because the site
 * references brand marks (e.g. GitHub, X) that were removed from
 * lucide-react. Rendering code falls back to a generic icon if the name
 * does not resolve inside DynamicIcon, so typing it as `string` keeps
 * authoring flexibility without masking real runtime gaps.
 */
export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  label?: string;
}

export interface NavLink {
  href: string;
  label: string;
}

export interface Career {
  company: string;
  role: string;
  period: {
    start: string;
    end?: string;
  };
  description: string;
  achievements: string[];
  technologies?: string[];
}

export type SkillCategory = 'cloud' | 'language' | 'database' | 'tool';

export type SkillLevel = 'expert' | 'advanced' | 'intermediate' | 'beginner';

export interface Skill {
  name: string;
  category: SkillCategory;
  level?: SkillLevel;
  years?: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  highlights?: string[];
  featured: boolean;
}

export type BlogPlatform = 'zenn' | 'qiita' | 'note' | 'amazon' | 'other';

export interface BlogPost {
  title: string;
  url: string;
  publishedAt: string;
  platform: BlogPlatform;
  description?: string;
  tags?: string[];
}

export interface Education {
  type: 'certification' | 'degree';
  title: string;
  institution?: string;
  date: string;
  description?: string;
}
