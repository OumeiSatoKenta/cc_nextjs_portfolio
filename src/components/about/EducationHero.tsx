import Image from 'next/image';
import type { EducationImage } from '@/types';

interface EducationHeroProps {
  images: EducationImage[];
}

export function EducationHero({ images }: EducationHeroProps) {
  if (images.length === 0) return null;

  return (
    <ul className="grid gap-16 md:grid-cols-2" aria-label="学術研究の背景画像">
      {images.map((img) => (
        <li key={img.src} className="flex flex-col gap-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-image bg-gray-50 shadow-subtle-card">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
            />
          </div>
          {img.caption && <p className="text-caption text-gray-500">{img.caption}</p>}
        </li>
      ))}
    </ul>
  );
}
