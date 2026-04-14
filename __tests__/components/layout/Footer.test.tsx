import { render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('lucide-react/dynamic', () => ({
  DynamicIcon: ({ name }: { name: string }) => <svg data-testid={`icon-${name}`} />,
}));

import { Footer } from '@/components/layout/Footer';
import { NAV_LINKS } from '@/data/navigation';
import { socialLinks } from '@/data/social';

const defaultProps = {
  authorName: 'Test Author',
  socialLinks,
  siteName: 'Test Site',
  siteDescription: 'A test site description',
  navLinks: NAV_LINKS,
};

describe('Footer', () => {
  it('renders the copyright with the current year and author name', () => {
    render(<Footer {...defaultProps} />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} ${defaultProps.authorName}`)).toBeInTheDocument();
  });

  it('adds target="_blank" and rel="noopener noreferrer" only to http(s) links', () => {
    render(<Footer {...defaultProps} />);

    socialLinks.forEach((link) => {
      const anchor = screen.getByLabelText(link.label ?? link.platform);
      expect(anchor).toBeInTheDocument();
      expect(anchor).toHaveAttribute('href', link.url);

      const isHttp = link.url.startsWith('http://') || link.url.startsWith('https://');
      if (isHttp) {
        expect(anchor).toHaveAttribute('target', '_blank');
        expect(anchor).toHaveAttribute('rel', 'noopener noreferrer');
      } else {
        expect(anchor).not.toHaveAttribute('target');
        expect(anchor).not.toHaveAttribute('rel');
      }
    });
  });

  it('renders the same number of social link items as socialLinks entries', () => {
    render(<Footer {...defaultProps} />);
    const socialList = screen.getByRole('list', { name: 'ソーシャルリンク' });
    const items = within(socialList).getAllByRole('listitem');
    expect(items).toHaveLength(socialLinks.length);
  });

  it('renders the site name', () => {
    render(<Footer {...defaultProps} />);
    expect(screen.getByText(defaultProps.siteName)).toBeInTheDocument();
  });

  it('renders the site description', () => {
    render(<Footer {...defaultProps} />);
    expect(screen.getByText(defaultProps.siteDescription)).toBeInTheDocument();
  });

  it('renders navigation links from navLinks', () => {
    render(<Footer {...defaultProps} />);
    const nav = screen.getByRole('navigation', { name: 'フッターナビゲーション' });
    const items = within(nav).getAllByRole('listitem');
    expect(items).toHaveLength(NAV_LINKS.length);
  });

  it('renders navigation links with correct href', () => {
    render(<Footer {...defaultProps} />);
    NAV_LINKS.forEach((navLink) => {
      const link = screen.getByRole('link', { name: navLink.label });
      expect(link.getAttribute('href')).toBe(navLink.href);
    });
  });
});
