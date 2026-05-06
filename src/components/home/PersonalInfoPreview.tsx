import { Sparkles } from 'lucide-react';
import type { PersonalInfo } from '@/types';

interface PersonalInfoPreviewProps {
  info: PersonalInfo;
}

export function PersonalInfoPreview({ info }: PersonalInfoPreviewProps) {
  return (
    <article className="rounded-image bg-pure-white p-32 shadow-subtle-card">
      <div className="flex items-center gap-12">
        <Sparkles className="text-vercel-black" size={20} aria-hidden="true" />
        <h3 className="text-card-title text-vercel-black">{info.type}</h3>
      </div>
      <p className="mt-16 text-body-medium text-gray-600">{info.typeDescription}</p>
      {info.source && (
        <p className="mt-16 text-caption text-gray-500">
          出典:{' '}
          <a
            href={info.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-link-blue hover:underline"
          >
            {info.source.name}
          </a>{' '}
          による適性診断
        </p>
      )}
    </article>
  );
}
