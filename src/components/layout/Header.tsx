'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useActiveNav } from '@/hooks/useActiveNav';
import type { NavLink } from '@/types';
import { Navigation } from './Navigation';

interface HeaderProps {
  siteName: string;
  navLinks: NavLink[];
}

export function Header({ siteName, navLinks }: HeaderProps) {
  const { isActive } = useActiveNav();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-pure-white shadow-ring">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-16 py-12">
          <Link href="/" className="text-body-semibold text-vercel-black">
            {siteName}
          </Link>

          <nav className="hidden md:block" aria-label="メインナビゲーション">
            <ul className="flex gap-32">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-button-link transition-colors ${
                      isActive(link.href)
                        ? 'font-semibold underline underline-offset-4'
                        : 'font-medium text-vercel-black hover:text-gray-600'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-circle p-8 focus-visible:shadow-focus focus-visible:outline-none md:hidden"
            onClick={() => setIsMenuOpen(true)}
            aria-label="メニューを開く"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      <Navigation isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} navLinks={navLinks} />
    </>
  );
}
