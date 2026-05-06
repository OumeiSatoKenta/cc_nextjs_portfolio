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

/** 雇用形態下の個別案件 (自社開発 / SES) を表すサブエントリ */
export type EngagementType = 'in-house' | 'ses';

export interface CareerEngagement {
  /** クライアント名・案件名 */
  client: string;
  engagementType: EngagementType;
  role: string;
  period: { start: string; end?: string };
  description: string;
  achievements: string[];
  technologies?: string[];
  teamSize?: number;
  roleType?: CareerRoleType[];
}

export interface Career extends CareerOverview {
  description: string;
  /** Parent-only 雇用エントリでは省略 (engagements 配下に詳細を持つ場合) */
  achievements?: string[];
  technologies?: string[];
  teamSize?: number;
  roleType?: CareerRoleType[];
  /** 雇用主の下にぶら下がる個別案件 (自社開発 + SES 案件など) */
  engagements?: CareerEngagement[];
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

/** 学位エントリ内にネストする論文・学会発表 */
export interface AcademicPublication {
  title: string;
  venue: string;
  date: string;
  description?: string;
}

export interface Education {
  type: 'certification' | 'degree' | 'publication';
  title: string;
  institution?: string;
  date: string;
  description?: string;
  details?: string;
  images?: EducationImage[];
  /** 学位エントリ配下に表示する論文・学会発表 */
  publications?: AcademicPublication[];
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

export type ActivityCategory =
  | 'meetup'
  | 'conference'
  | 'study-group'
  | 'oss'
  | 'publication'
  | 'other';

export interface Activity {
  id: string;
  title: string;
  /** ISO 8601: YYYY, YYYY-MM, or YYYY-MM-DD. Year-only entries denote ongoing activity within that year. */
  date: string;
  category: ActivityCategory;
  description: string;
  role?: string;
  url?: string;
  tags?: string[];
  /** Activity that started on `date` and is still ongoing. Renders the date as "...〜現在". */
  ongoing?: boolean;
}
