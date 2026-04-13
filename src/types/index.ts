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
