'use client';

import { Check, type LucideIcon, Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useId, useRef, useState } from 'react';

type ThemeOption = 'system' | 'light' | 'dark';

interface ThemeOptionDef {
  value: ThemeOption;
  label: string;
  Icon: LucideIcon;
}

const OPTIONS: ThemeOptionDef[] = [
  { value: 'system', label: 'ブラウザのデフォルト', Icon: Monitor },
  { value: 'light', label: 'ライト', Icon: Sun },
  { value: 'dark', label: 'ダーク', Icon: Moon },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- next-themes hydration guard
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!mounted) {
    return <div className="h-28 w-80" aria-hidden="true" />;
  }

  const currentTheme = (theme ?? 'system') as ThemeOption;
  const currentOption = OPTIONS.find((o) => o.value === currentTheme) ?? OPTIONS[0];
  const TriggerIcon = currentOption.Icon;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`ビジュアルモード: 現在${currentOption.label}`}
        className="inline-flex items-center gap-6 rounded-pill px-10 py-6 text-vercel-black transition-colors hover:bg-gray-50 hover:text-gray-600 focus-visible:shadow-focus focus-visible:outline-none"
      >
        <TriggerIcon size={16} />
        <span className="text-caption">{currentOption.label}</span>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="ビジュアルモードを選択"
          className="absolute right-0 z-50 mt-8 w-240 overflow-hidden rounded-comfortable bg-pure-white shadow-full-card ring-1 ring-gray-100"
        >
          <div className="flex items-center gap-8 border-gray-100 border-b px-16 py-12">
            <span className="font-medium text-caption text-vercel-black">ビジュアルモード</span>
            <span className="rounded-pill bg-badge-cloud-bg px-8 py-2 font-medium text-badge-cloud-text text-caption">
              ベータ
            </span>
          </div>
          <ul className="flex flex-col py-4">
            {OPTIONS.map(({ value, label, Icon }) => {
              const active = value === currentTheme;
              return (
                <li key={value}>
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    onClick={() => {
                      setTheme(value);
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-8 px-16 py-8 text-left text-vercel-black transition-colors hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none"
                  >
                    <Icon size={16} />
                    <span className="flex-1 text-caption">{label}</span>
                    {active && <Check size={14} aria-hidden="true" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
