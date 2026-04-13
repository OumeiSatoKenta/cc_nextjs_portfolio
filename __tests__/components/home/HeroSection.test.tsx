import { render, screen } from '@testing-library/react';
import { HeroSection } from '@/components/home/HeroSection';

describe('HeroSection', () => {
  const defaultProps = {
    name: 'Your Name',
    tagline: 'SRE Engineer — Multi-Cloud · IaC · AI-Driven Development',
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
    const link = screen.getByRole('link', { name: 'Projects を見る' });
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toMatch(/^\/projects\/?$/);
  });

  it('wraps content in a section element', () => {
    const { container } = render(<HeroSection {...defaultProps} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });
});
