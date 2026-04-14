import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';
import { siteMetadata } from '@/data/metadata';

describe('HomePage', () => {
  it('renders the author name as the h1 heading', () => {
    render(<HomePage />);
    const heading = screen.getByRole('heading', {
      level: 1,
      name: siteMetadata.author.name,
    });
    expect(heading).toBeInTheDocument();
  });

  it('renders the tagline from siteMetadata', () => {
    render(<HomePage />);
    expect(screen.getByText(siteMetadata.author.tagline)).toBeInTheDocument();
  });

  it('renders one StrengthCard article per strength in siteMetadata', () => {
    render(<HomePage />);
    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(siteMetadata.author.strengths.length);
  });

  it('renders each strength title as an h3 heading', () => {
    render(<HomePage />);
    siteMetadata.author.strengths.forEach((strength) => {
      expect(screen.getByRole('heading', { level: 3, name: strength.title })).toBeInTheDocument();
    });
  });

  it('renders a CTA link to /projects/', () => {
    render(<HomePage />);
    const link = screen.getByRole('link', { name: 'Side Projects を見る' });
    expect(link.getAttribute('href')).toMatch(/^\/projects\/?$/);
  });

  it('renders each stat value from siteMetadata.author.stats', () => {
    render(<HomePage />);
    siteMetadata.author.stats.forEach((stat) => {
      expect(screen.getByText(stat.value)).toBeInTheDocument();
    });
  });

  it('renders a secondary CTA link to /about/', () => {
    render(<HomePage />);
    const link = screen.getByRole('link', { name: 'About を見る' });
    expect(link.getAttribute('href')).toMatch(/^\/about\/?$/);
  });
});
