import { render, screen } from '@testing-library/react';

jest.mock('lucide-react/dynamic', () => ({
  DynamicIcon: ({ name }: { name: string }) => <svg data-testid={`icon-${name}`} />,
}));

import { Footer } from '@/components/layout/Footer';
import { socialLinks } from '@/data/social';

const AUTHOR = 'Test Author';

describe('Footer', () => {
  it('renders the copyright with the current year and author name', () => {
    render(<Footer authorName={AUTHOR} socialLinks={socialLinks} />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} ${AUTHOR}`)).toBeInTheDocument();
  });

  it('adds target="_blank" and rel="noopener noreferrer" only to http(s) links', () => {
    render(<Footer authorName={AUTHOR} socialLinks={socialLinks} />);

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
    render(<Footer authorName={AUTHOR} socialLinks={socialLinks} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(socialLinks.length);
  });
});
