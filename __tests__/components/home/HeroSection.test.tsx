import { render, screen } from '@testing-library/react';
import { HeroSection } from '@/components/home/HeroSection';

describe('HeroSection', () => {
  const defaultProps = {
    name: 'Your Name',
    tagline: 'SRE Engineer — Multi-Cloud · IaC · AI-Driven Development',
    stats: [
      { label: '年のSRE経験', value: '5+' },
      { label: 'クラウド基盤', value: '3' },
    ],
  };

  it('renders the name as the h1 heading', () => {
    render(<HeroSection {...defaultProps} />);
    const heading = screen.getByRole('heading', { level: 1, name: defaultProps.name });
    expect(heading).toBeInTheDocument();
  });

  it('renders the tagline text', () => {
    render(<HeroSection {...defaultProps} />);
    expect(screen.getByText(defaultProps.tagline)).toBeInTheDocument();
  });

  it('renders a CTA link that points to /projects/', () => {
    render(<HeroSection {...defaultProps} />);
    const link = screen.getByRole('link', { name: 'Side Projects を見る' });
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toMatch(/^\/projects\/?$/);
  });

  it('wraps content in a section element', () => {
    render(<HeroSection {...defaultProps} />);
    expect(screen.getByRole('region', { name: 'ヒーロー' })).toBeInTheDocument();
  });

  it('renders each stat value when stats are provided', () => {
    render(<HeroSection {...defaultProps} />);
    defaultProps.stats.forEach((stat) => {
      expect(screen.getByText(stat.value)).toBeInTheDocument();
    });
  });

  it('renders a secondary CTA link to /about/', () => {
    render(<HeroSection {...defaultProps} />);
    const link = screen.getByRole('link', { name: 'About を見る' });
    expect(link.getAttribute('href')).toMatch(/^\/about\/?$/);
  });

  it('does not render the stats list when stats is empty', () => {
    const { container } = render(<HeroSection {...defaultProps} stats={[]} />);
    expect(container.querySelector('dl')).not.toBeInTheDocument();
  });
});
