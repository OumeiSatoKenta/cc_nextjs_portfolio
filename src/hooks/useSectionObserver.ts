'use client';

import { useEffect, useState } from 'react';

interface UseSectionObserverOptions {
  sectionIds: string[];
  rootMargin?: string;
}

/**
 * IntersectionObserver でアクティブなセクション ID を返す。
 * 複数のセクションが同時に交差する場合、最も上にあるものを優先する。
 *
 * Note: `sectionIds` は参照が安定した配列（呼び出し側で `useMemo` でメモ化したもの）を
 * 渡すこと。新しい配列参照を毎レンダー渡すと `useEffect` が再実行され、
 * IntersectionObserver が disconnect/reconnect を繰り返す。
 */
export function useSectionObserver({
  sectionIds,
  rootMargin = '-20% 0px -60% 0px',
}: UseSectionObserverOptions): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    // Maintain a full visibility map across callbacks because IntersectionObserver
    // only delivers entries that *changed* — without this we'd lose track of
    // sections that became visible earlier and are still on screen.
    const visibilityMap = new Map<string, IntersectionObserverEntry>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibilityMap.set(entry.target.id, entry);
        }
        const visible = Array.from(visibilityMap.values())
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        setActiveId(visible[0]?.target.id ?? null);
      },
      { rootMargin }
    );

    for (const el of elements) {
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sectionIds, rootMargin]);

  return activeId;
}
