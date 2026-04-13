import { usePathname } from 'next/navigation';

interface UseActiveNavResult {
  pathname: string;
  isActive: (href: string) => boolean;
}

export function useActiveNav(): UseActiveNavResult {
  const pathname = usePathname() ?? '/';

  const isActive = (href: string): boolean => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return { pathname, isActive };
}
