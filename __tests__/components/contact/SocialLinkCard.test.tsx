import { render, screen } from '@testing-library/react';

jest.mock('lucide-react/dynamic', () => ({
  DynamicIcon: ({ name }: { name: string }) => <svg data-testid={`icon-${name}`} />,
}));

import { SocialLinkCard } from '@/components/contact/SocialLinkCard';

const externalProps = {
  platform: 'GitHub',
  url: 'https://github.com/testuser',
  icon: 'github',
};

const mailProps = {
  platform: 'Mail',
  url: 'mailto:test@example.com',
  icon: 'mail',
};

describe('SocialLinkCard', () => {
  it('renders platform name as h3', () => {
    render(<SocialLinkCard {...externalProps} />);
    expect(screen.getByRole('heading', { level: 3, name: 'GitHub' })).toBeInTheDocument();
  });

  it('renders as article element', () => {
    const { container } = render(<SocialLinkCard {...externalProps} />);
    expect(container.querySelector('article')).toBeInTheDocument();
  });

  it('renders external link with security attributes', () => {
    render(<SocialLinkCard {...externalProps} />);
    const link = screen.getByRole('link', { name: 'GitHub →' });
    expect(link).toHaveAttribute('href', 'https://github.com/testuser');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders mailto link with target="_blank" but without rel', () => {
    render(<SocialLinkCard {...mailProps} />);
    const link = screen.getByRole('link', { name: 'Mail →' });
    expect(link).toHaveAttribute('href', 'mailto:test@example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).not.toHaveAttribute('rel');
  });

  it('uses label prop when provided', () => {
    render(<SocialLinkCard {...externalProps} label="My GitHub" />);
    expect(screen.getByRole('heading', { level: 3, name: 'My GitHub' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'My GitHub →' })).toBeInTheDocument();
  });

  it('falls back to platform when label is not provided', () => {
    render(<SocialLinkCard {...externalProps} />);
    expect(screen.getByRole('heading', { level: 3, name: 'GitHub' })).toBeInTheDocument();
  });
});
