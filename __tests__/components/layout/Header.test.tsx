import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type MockedFunction, vi } from 'vitest';
import { Header } from '@/components/layout/Header';
import { NAV_LINKS } from '@/data/navigation';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

import { usePathname } from 'next/navigation';

const mockedUsePathname = usePathname as MockedFunction<typeof usePathname>;

const SITE_NAME = 'Test Site';

const renderHeader = () => render(<Header siteName={SITE_NAME} navLinks={NAV_LINKS} />);

describe('Header', () => {
  beforeEach(() => {
    mockedUsePathname.mockReturnValue('/');
  });

  it('renders all navigation links from NAV_LINKS', () => {
    renderHeader();

    const desktopNav = screen.getByRole('navigation', { name: 'メインナビゲーション' });
    NAV_LINKS.forEach((link) => {
      const anchor = Array.from(desktopNav.querySelectorAll('a')).find(
        (a) => a.textContent === link.label
      );
      expect(anchor).toBeInTheDocument();
      expect(anchor).toHaveAttribute('href', link.href);
    });
  });

  it('applies active styles to the link matching the current pathname', () => {
    mockedUsePathname.mockReturnValue('/about');
    renderHeader();

    const desktopNav = screen.getByRole('navigation', { name: 'メインナビゲーション' });
    const aboutLink = Array.from(desktopNav.querySelectorAll('a')).find(
      (a) => a.textContent === 'About'
    );
    const homeLink = Array.from(desktopNav.querySelectorAll('a')).find(
      (a) => a.textContent === 'Home'
    );

    expect(aboutLink?.className).toContain('font-semibold');
    expect(aboutLink?.className).toContain('underline');
    expect(homeLink?.className).not.toContain('font-semibold');
  });

  it('does not apply active styles for prefix-only matches like /blog vs /blogger', () => {
    mockedUsePathname.mockReturnValue('/blogger');
    renderHeader();

    const desktopNav = screen.getByRole('navigation', { name: 'メインナビゲーション' });
    const blogLink = Array.from(desktopNav.querySelectorAll('a')).find(
      (a) => a.textContent === 'Blog'
    );
    expect(blogLink?.className).not.toContain('font-semibold');
  });

  it('renders the site name link pointing to root', () => {
    renderHeader();

    const siteLinks = screen.getAllByRole('link');
    const rootLink = siteLinks.find(
      (link) => link.getAttribute('href') === '/' && link.textContent === SITE_NAME
    );
    expect(rootLink).toBeInTheDocument();
  });

  it('renders the mobile menu open button', () => {
    renderHeader();
    expect(screen.getByRole('button', { name: 'メニューを開く' })).toBeInTheDocument();
  });

  it('opens Sheet with navigation links when menu button is clicked', async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(screen.getByRole('button', { name: 'メニューを開く' }));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    const mobileNav = screen.getByRole('navigation', { name: 'モバイルナビゲーション' });
    NAV_LINKS.forEach((link) => {
      const anchor = Array.from(mobileNav.querySelectorAll('a')).find(
        (a) => a.textContent === link.label
      );
      expect(anchor).toBeInTheDocument();
    });
  });

  it('closes Sheet when a mobile nav link is clicked', async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(screen.getByRole('button', { name: 'メニューを開く' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const mobileNav = screen.getByRole('navigation', { name: 'モバイルナビゲーション' });
    const aboutLink = Array.from(mobileNav.querySelectorAll('a')).find(
      (a) => a.textContent === 'About'
    );
    await user.click(aboutLink!);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes Sheet when close button is clicked', async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(screen.getByRole('button', { name: 'メニューを開く' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'メニューを閉じる' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes Sheet when Escape key is pressed', async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(screen.getByRole('button', { name: 'メニューを開く' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
