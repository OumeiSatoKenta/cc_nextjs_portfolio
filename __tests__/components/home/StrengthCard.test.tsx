import { render, screen } from '@testing-library/react';
import { StrengthCard } from '@/components/home/StrengthCard';

describe('StrengthCard', () => {
  const baseProps = {
    title: 'マルチクラウド',
    description: 'AWS・Google Cloud の両クラウドで IaC 運用',
    accentColor: 'develop' as const,
  };

  it('renders the title as an h3 heading', () => {
    render(<StrengthCard {...baseProps} />);
    const heading = screen.getByRole('heading', { level: 3, name: baseProps.title });
    expect(heading).toBeInTheDocument();
  });

  it('renders the description text', () => {
    render(<StrengthCard {...baseProps} />);
    expect(screen.getByText(baseProps.description)).toBeInTheDocument();
  });

  it('wraps content in an article element', () => {
    const { container } = render(<StrengthCard {...baseProps} />);
    expect(container.querySelector('article')).toBeInTheDocument();
  });

  it('applies bg-ship-red class to the accent bar when accentColor is ship', () => {
    const { container } = render(<StrengthCard {...baseProps} accentColor="ship" />);
    const accentBar = container.querySelector('[aria-hidden="true"]');
    expect(accentBar).toHaveClass('bg-ship-red');
  });

  it('applies bg-preview-pink class to the accent bar when accentColor is preview', () => {
    const { container } = render(<StrengthCard {...baseProps} accentColor="preview" />);
    const accentBar = container.querySelector('[aria-hidden="true"]');
    expect(accentBar).toHaveClass('bg-preview-pink');
  });

  it('applies bg-develop-blue class to the accent bar when accentColor is develop', () => {
    const { container } = render(<StrengthCard {...baseProps} accentColor="develop" />);
    const accentBar = container.querySelector('[aria-hidden="true"]');
    expect(accentBar).toHaveClass('bg-develop-blue');
  });

  it('marks the accent bar as aria-hidden for assistive technology', () => {
    const { container } = render(<StrengthCard {...baseProps} />);
    const accentBar = container.querySelector('[aria-hidden="true"]');
    expect(accentBar).toBeInTheDocument();
  });
});
