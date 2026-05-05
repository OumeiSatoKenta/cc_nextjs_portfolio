'use client';

import { useMemo } from 'react';
import { useSectionObserver } from '@/hooks/useSectionObserver';

interface NavItem {
  id: string;
  label: string;
}

interface StickyNavProps {
  items: NavItem[];
}

export function StickyNav({ items }: StickyNavProps) {
  const sectionIds = useMemo(() => items.map((i) => i.id), [items]);
  const activeId = useSectionObserver({ sectionIds });
  const currentId = activeId ?? items[0]?.id ?? null;

  return (
    <nav
      aria-label="ページ内ナビゲーション"
      className="sticky top-[var(--header-height)] z-40 bg-pure-white/90 shadow-subtle-card backdrop-blur"
    >
      <div className="mx-auto max-w-[1200px] px-16 md:px-32">
        <ul className="flex gap-16 overflow-x-auto py-8">
          {items.map((item) => {
            const isActive = currentId === item.id;
            return (
              <li key={item.id} className="shrink-0">
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? 'location' : undefined}
                  className={`rounded-pill px-12 py-4 text-button-link transition-colors ${
                    isActive
                      ? 'bg-vercel-black text-pure-white'
                      : 'text-vercel-black hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
