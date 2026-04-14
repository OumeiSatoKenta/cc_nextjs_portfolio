import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('lucide-react/dynamic', () => ({
  DynamicIcon: ({ name }: { name: string }) => <svg data-testid={`icon-${name}`} />,
}));

import ContactPage from '@/app/contact/page';
import { socialLinks } from '@/data/social';

const otherLinks = socialLinks.filter(
  (link) => link.platform !== 'Mail' && link.platform !== 'LinkedIn'
);

describe('ContactPage', () => {
  it('renders h1 with "Contact"', () => {
    render(<ContactPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Contact' })).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<ContactPage />);
    expect(screen.getByText('各種SNS・プラットフォーム')).toBeInTheDocument();
  });

  it('renders other social link platform names (excluding Mail and LinkedIn)', () => {
    render(<ContactPage />);
    for (const link of otherLinks) {
      const displayName = link.label ?? link.platform;
      expect(screen.getByRole('heading', { level: 3, name: displayName })).toBeInTheDocument();
    }
  });

  it('renders other social link cards plus CTA links', () => {
    render(<ContactPage />);
    const links = screen.getAllByRole('link');
    // otherLinks cards + CTA mail button + CTA LinkedIn button
    expect(links).toHaveLength(otherLinks.length + 2);
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

  it('renders CTA heading', () => {
    render(<ContactPage />);
    expect(
      screen.getByRole('heading', { level: 2, name: 'お気軽にご連絡ください' })
    ).toBeInTheDocument();
  });

  it('renders CTA mail button with mailto href', () => {
    render(<ContactPage />);
    const mailButton = screen.getByRole('link', { name: 'メールを送る' });
    expect(mailButton).toBeInTheDocument();
    expect(mailButton.getAttribute('href')).toMatch(/^mailto:/);
  });

  it('renders CTA LinkedIn link with security attributes', () => {
    render(<ContactPage />);
    const ctaSection = screen.getByLabelText('お問い合わせ');
    const linkedinButton = ctaSection.querySelector('a[target="_blank"]');
    expect(linkedinButton).toBeInTheDocument();
    expect(linkedinButton).toHaveAttribute('rel', 'noopener noreferrer');
    expect(linkedinButton?.getAttribute('href')).toMatch(/linkedin\.com/);
  });

  it('renders CTA supplementary text', () => {
    render(<ContactPage />);
    expect(screen.getByText('返信は通常 1〜2 営業日以内にお送りします')).toBeInTheDocument();
  });
});
