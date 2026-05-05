'use client';

import Image from 'next/image';
import { useId, useState } from 'react';
import type { Education } from '@/types';

const TYPE_LABEL: Record<Education['type'], string> = {
  publication: '論文',
  certification: '資格',
  degree: '学歴',
};

const TYPE_BADGE_CLASS: Record<Education['type'], string> = {
  publication: 'bg-badge-lang-bg text-badge-lang-text',
  certification: 'bg-badge-db-bg text-badge-db-text',
  degree: 'bg-badge-cloud-bg text-badge-cloud-text',
};

const TYPE_DATE_PREFIX: Record<Education['type'], string> = {
  publication: '発表: ',
  certification: '取得: ',
  degree: '修了: ',
};

interface EducationAccordionProps {
  educations: Education[];
}

export function EducationAccordion({ educations }: EducationAccordionProps) {
  return (
    <ul className="flex flex-col gap-16">
      {educations.map((edu) => (
        <EducationItem
          key={`${edu.type}-${edu.institution ?? ''}-${edu.date}-${edu.title}`}
          edu={edu}
        />
      ))}
    </ul>
  );
}

interface EducationItemProps {
  edu: Education;
}

export function EducationItem({ edu }: EducationItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();
  const expandable = Boolean(edu.details || (edu.images && edu.images.length > 0));

  const headerContent = (
    <>
      <span
        className={`inline-block self-start rounded-pill px-10 py-3 font-medium text-caption ${TYPE_BADGE_CLASS[edu.type]}`}
      >
        {TYPE_LABEL[edu.type]}
      </span>
      <h3 className="text-card-title text-vercel-black">{edu.title}</h3>
      {edu.institution && <p className="text-body-small text-gray-600">{edu.institution}</p>}
      <time dateTime={edu.date} className="font-geist-mono text-caption text-gray-500">
        {TYPE_DATE_PREFIX[edu.type]}
        {edu.date}
      </time>
      {edu.description && <p className="text-body-small text-gray-600">{edu.description}</p>}
      {expandable && (
        <span className="font-medium text-button-link text-link-blue">
          {isOpen ? '詳細を閉じる ▲' : '詳細を見る ▼'}
        </span>
      )}
    </>
  );

  return (
    <li>
      <div className="rounded-comfortable bg-pure-white shadow-subtle-card">
        {expandable ? (
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
            aria-controls={contentId}
            className="flex w-full flex-col gap-8 p-32 text-left"
          >
            {headerContent}
          </button>
        ) : (
          <div className="flex flex-col gap-8 p-32 text-left">{headerContent}</div>
        )}
        {expandable && (
          <div
            id={contentId}
            className="accordion-content"
            data-state={isOpen ? 'open' : 'closed'}
            aria-hidden={!isOpen}
          >
            <div>
              <div className="flex flex-col gap-16 px-32 pb-32">
                {edu.details && <p className="text-body-small text-gray-600">{edu.details}</p>}
                {edu.images && edu.images.length > 0 && (
                  <ul className="grid gap-16 md:grid-cols-2">
                    {edu.images.map((img) => (
                      <li key={img.src} className="flex flex-col gap-8">
                        <div className="relative aspect-[16/9] overflow-hidden rounded-image bg-gray-50">
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
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}
