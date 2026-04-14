'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const THEME_CYCLE = ['system', 'light', 'dark'] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- next-themes hydration guard
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-28 w-80" aria-hidden="true" />;
  }

  const currentTheme = theme ?? 'system';
  const currentIndex = THEME_CYCLE.indexOf(currentTheme as (typeof THEME_CYCLE)[number]);
  const nextTheme = THEME_CYCLE[(currentIndex + 1) % THEME_CYCLE.length];

  const Icon = currentTheme === 'dark' ? Moon : currentTheme === 'light' ? Sun : Monitor;
  const label =
    currentTheme === 'dark' ? 'ダーク' : currentTheme === 'light' ? 'ライト' : 'システム';

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      className="inline-flex items-center gap-6 rounded-pill px-10 py-6 text-vercel-black transition-colors hover:bg-gray-50 hover:text-gray-600 focus-visible:shadow-focus focus-visible:outline-none"
      aria-label={`テーマ切替: 現在${label}モード`}
    >
      <Icon size={16} />
      <span className="text-caption">{label}</span>
    </button>
  );
}
