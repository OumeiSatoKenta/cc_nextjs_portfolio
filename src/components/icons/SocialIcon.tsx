import { Calendar, Mail } from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';
import { GithubIcon } from './GithubIcon';
import { LinkedinIcon } from './LinkedinIcon';

const iconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  calendar: Calendar,
  mail: Mail,
};

interface SocialIconProps {
  name: string;
  size?: number;
  className?: string;
}

export function SocialIcon({ name, size = 24, className }: SocialIconProps) {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon width={size} height={size} className={className} aria-hidden="true" />;
}
