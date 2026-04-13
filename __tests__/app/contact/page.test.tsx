import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('lucide-react/dynamic', () => ({
  DynamicIcon: ({ name }: { name: string }) => <svg data-testid={`icon-${name}`} />,
}));

import ContactPage from '@/app/contact/page';
import { socialLinks } from '@/data/social';

describe('ContactPage', () => {
  it('renders h1 with "Contact"', () => {
    render(<ContactPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Contact' })).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<ContactPage />);
    expect(screen.getByText('各種SNS・プラットフォーム')).toBeInTheDocument();
  });

  it('renders all social link platform names', () => {
    render(<ContactPage />);
    for (const link of socialLinks) {
      const displayName = link.label ?? link.platform;
      expect(screen.getByRole('heading', { level: 3, name: displayName })).toBeInTheDocument();
    }
  });

  it('renders the correct number of links', () => {
    render(<ContactPage />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(socialLinks.length);
  });

  it('renders all links with target="_blank"', () => {
    render(<ContactPage />);
    const links = screen.getAllByRole('link');
    for (const link of links) {
      expect(link).toHaveAttribute('target', '_blank');
    }
  });

  it('renders external http links with rel="noopener noreferrer"', () => {
    render(<ContactPage />);
    const links = screen.getAllByRole('link');
    for (const link of links) {
      const href = link.getAttribute('href') ?? '';
      if (href.startsWith('http')) {
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      }
    }
  });

  it('renders mailto link without rel attribute', () => {
    render(<ContactPage />);
    const links = screen.getAllByRole('link');
    for (const link of links) {
      const href = link.getAttribute('href') ?? '';
      if (href.startsWith('mailto:')) {
        expect(link).not.toHaveAttribute('rel');
      }
    }
  });
});
