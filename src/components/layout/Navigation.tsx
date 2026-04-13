'use client';

import { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import type { NavLink } from '@/types';
import { useActiveNav } from '@/hooks/useActiveNav';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
}

export function Navigation({ isOpen, onClose, navLinks }: NavigationProps) {
  const { pathname, isActive } = useActiveNav();
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && menuRef.current) {
        const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
          'button, a[href]'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  // Close the menu when the route actually changes (e.g. browser back/forward).
  // Skip the initial mount so opening the menu doesn't immediately close itself.
  const previousPathname = useRef(pathname);
  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    if (isOpen) onClose();
  }, [pathname, isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-200 ease-out ${
        isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!isOpen}
      {...(!isOpen ? { inert: '' as unknown as boolean } : {})}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[rgba(0,0,0,0.4)]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu panel */}
      <div
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="ナビゲーションメニュー"
        className={`absolute right-0 top-0 h-full w-3/4 max-w-[300px] bg-pure-white shadow-full-card transition-transform duration-200 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-end px-16 py-12">
          <button
            ref={closeButtonRef}
            type="button"
            className="inline-flex items-center justify-center rounded-circle p-8 focus-visible:shadow-focus focus-visible:outline-none"
            onClick={onClose}
            aria-label="メニューを閉じる"
          >
            <X size={24} />
          </button>
        </div>

        <nav aria-label="モバイルナビゲーション">
          <ul className="flex flex-col gap-8 px-16">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className={`block rounded-standard px-12 py-10 text-body-medium transition-colors ${
                    isActive(link.href)
                      ? 'font-semibold underline underline-offset-4'
                      : 'text-vercel-black hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
