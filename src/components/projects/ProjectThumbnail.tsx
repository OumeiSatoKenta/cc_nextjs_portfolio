import { BookOpen, Cloud, Globe, PenTool, Presentation, Users } from 'lucide-react';
import Image from 'next/image';
import type { ComponentType, SVGProps } from 'react';
import type { ProjectAccentColor } from '@/types';

const iconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  Globe,
  Cloud,
  Users,
  BookOpen,
  PenTool,
  Presentation,
};

const gradientMap: Record<ProjectAccentColor, string> = {
  ship: 'from-ship-red/20 to-ship-red/5',
  preview: 'from-preview-pink/20 to-preview-pink/5',
  develop: 'from-develop-blue/20 to-develop-blue/5',
};

const iconColorMap: Record<ProjectAccentColor, string> = {
  ship: 'text-ship-red',
  preview: 'text-preview-pink',
  develop: 'text-develop-blue',
};

interface ProjectThumbnailProps {
  accentColor: ProjectAccentColor;
  icon: string;
  image?: string;
  fit?: 'cover' | 'contain';
}

export function ProjectThumbnail({
  accentColor,
  icon,
  image,
  fit = 'cover',
}: ProjectThumbnailProps) {
  if (image) {
    return (
      <div
        className={`relative h-180 overflow-hidden rounded-image bg-gradient-to-br ${gradientMap[accentColor]}`}
        aria-hidden="true"
      >
        <Image
          src={image}
          alt=""
          fill
          className={fit === 'contain' ? 'object-contain' : 'object-cover object-top'}
        />
      </div>
    );
  }

  const Icon = iconMap[icon];
  if (!Icon) return null;

  return (
    <div
      className={`grid h-180 place-items-center rounded-image bg-gradient-to-br ${gradientMap[accentColor]}`}
      aria-hidden="true"
    >
      <Icon width={48} height={48} className={`opacity-60 ${iconColorMap[accentColor]}`} />
    </div>
  );
}
