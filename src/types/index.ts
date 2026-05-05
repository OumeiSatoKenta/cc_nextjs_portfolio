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
    personalInfo?: PersonalInfo;
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

export interface CareerOverview {
  company: string;
  role: string;
  period: {
    start: string;
    end?: string;
  };
}

export type CareerRoleType = 'design' | 'implementation' | 'management' | 'operations';

export interface Career extends CareerOverview {
  description: string;
  achievements: string[];
  technologies?: string[];
  teamSize?: number;
  roleType?: CareerRoleType[];
}

export type SkillCategory = 'cloud' | 'language' | 'database' | 'tool';

export type SkillLevel = 'expert' | 'advanced' | 'intermediate' | 'beginner';

export interface Skill {
  name: string;
  category: SkillCategory;
  level?: SkillLevel;
  years?: number;
  description?: string;
  icon?: string;
}

export type ProjectAccentColor = 'ship' | 'preview' | 'develop';

export interface ProjectThumbnail {
  accentColor: ProjectAccentColor;
  icon: string;
  image?: string;
  fit?: 'cover' | 'contain';
  background?: 'gradient' | 'white';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  highlights?: string[];
  metrics?: { label: string; value: string }[];
  linkLabel?: string;
  thumbnail?: ProjectThumbnail;
  featured: boolean;
  teamSize?: number;
  role?: string;
  userCount?: string;
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

export interface EducationImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface Education {
  type: 'certification' | 'degree' | 'publication';
  title: string;
  institution?: string;
  date: string;
  description?: string;
  details?: string;
  images?: EducationImage[];
}

export interface PersonalQuality {
  title: string;
  description: string;
}

export interface PersonalInfoSource {
  name: string;
  url: string;
}

export interface PersonalInfo {
  type: string;
  typeDescription: string;
  topQualities: PersonalQuality[];
  selfAwareness: string[];
  source?: PersonalInfoSource;
}
