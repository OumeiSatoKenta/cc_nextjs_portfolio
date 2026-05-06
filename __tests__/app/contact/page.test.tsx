import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('lucide-react/dynamic', () => ({
  DynamicIcon: ({ name }: { name: string }) => <svg data-testid={`icon-${name}`} />,
}));

import ContactPage from '@/app/contact/page';
import { socialLinks } from '@/data/social';

const otherLinks = socialLinks.filter((link) => link.platform !== 'LinkedIn');

describe('ContactPage', () => {
  it('renders h1 with "お問い合わせ"', () => {
    render(<ContactPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'お問い合わせ' })).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<ContactPage />);
    expect(screen.getByText('各種SNS・プラットフォーム')).toBeInTheDocument();
  });

  it('renders other social link platform names (excluding LinkedIn)', () => {
    render(<ContactPage />);
    for (const link of otherLinks) {
      const displayName = link.label ?? link.platform;
      expect(screen.getByRole('heading', { level: 3, name: displayName })).toBeInTheDocument();
    }
  });

  it('renders other social link cards plus the LinkedIn CTA', () => {
    render(<ContactPage />);
    const links = screen.getAllByRole('link');
    // otherLinks cards + 1 LinkedIn CTA button
    expect(links).toHaveLength(otherLinks.length + 1);
  });

  it('renders social link cards with target="_blank"', () => {
    render(<ContactPage />);
    const section = screen.getByLabelText('リンク一覧');
    const links = Array.from(section.querySelectorAll('a'));
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

  it('does not render any mailto links (email contact has been omitted)', () => {
    render(<ContactPage />);
    const links = screen.getAllByRole('link');
    for (const link of links) {
      const href = link.getAttribute('href') ?? '';
      expect(href.startsWith('mailto:')).toBe(false);
    }
  });

  it('renders CTA heading', () => {
    render(<ContactPage />);
    expect(
      screen.getByRole('heading', { level: 2, name: 'お気軽にご連絡ください' })
    ).toBeInTheDocument();
  });

  it('renders the LinkedIn CTA as the sole contact action with security attributes', () => {
    render(<ContactPage />);
    const ctaSection = screen.getByLabelText('お問い合わせ');
    const ctaLinks = Array.from(ctaSection.querySelectorAll('a'));
    expect(ctaLinks).toHaveLength(1);

    const linkedinButton = ctaLinks[0];
    expect(linkedinButton).toHaveAttribute('target', '_blank');
    expect(linkedinButton).toHaveAttribute('rel', 'noopener noreferrer');
    expect(linkedinButton.getAttribute('href')).toMatch(/linkedin\.com/);
    expect(linkedinButton.textContent).toMatch(/LinkedIn/);
  });
});
