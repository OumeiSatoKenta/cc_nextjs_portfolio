'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useActiveNav } from '@/hooks/useActiveNav';
import type { NavLink } from '@/types';

interface HeaderProps {
  siteName: string;
  navLinks: NavLink[];
}

export function Header({ siteName, navLinks }: HeaderProps) {
  const { pathname, isActive } = useActiveNav();
  const [isOpen, setIsOpen] = useState(false);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (isOpen) setIsOpen(false);
  }

  return (
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

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger
            className="inline-flex items-center justify-center rounded-circle p-8 focus-visible:shadow-focus focus-visible:outline-none md:hidden"
            aria-label="メニューを開く"
          >
            <Menu size={24} />
          </SheetTrigger>
          <SheetContent side="right" aria-label="ナビゲーションメニュー">
            <SheetTitle>ナビゲーション</SheetTitle>
            <SheetDescription>サイト内のページへ移動</SheetDescription>
            <nav aria-label="モバイルナビゲーション" className="mt-40">
              <ul className="flex flex-col gap-8 px-16">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
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
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
