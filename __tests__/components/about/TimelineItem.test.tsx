import { render, screen } from '@testing-library/react';
import { TimelineItem } from '@/components/about/TimelineItem';

describe('TimelineItem', () => {
  const baseProps = {
    company: '株式会社テスト',
    role: 'SRE エンジニア',
    period: { start: '2025-01', end: '2026-04' },
    description: 'テスト用の業務概要',
    achievements: ['成果 A', '成果 B'],
    technologies: ['AWS', 'Terraform'],
    isLast: false,
  };

  it('renders company name as an h3 heading', () => {
    render(<TimelineItem {...baseProps} />);
    expect(screen.getByRole('heading', { level: 3, name: baseProps.company })).toBeInTheDocument();
  });

  it('renders the period in a time element', () => {
    render(<TimelineItem {...baseProps} />);
    const timeEl = screen.getByText('2025-01 — 2026-04');
    expect(timeEl.tagName).toBe('TIME');
  });

  it('displays "現在" when period.end is undefined', () => {
    render(<TimelineItem {...baseProps} period={{ start: '2026-02' }} />);
    expect(screen.getByText('2026-02 — 現在')).toBeInTheDocument();
  });

  it('renders the role text', () => {
    render(<TimelineItem {...baseProps} />);
    expect(screen.getByText(baseProps.role)).toBeInTheDocument();
  });

  it('renders achievements as list items', () => {
    render(<TimelineItem {...baseProps} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(screen.getByText('成果 A')).toBeInTheDocument();
    expect(screen.getByText('成果 B')).toBeInTheDocument();
  });

  it('renders technology badges', () => {
    render(<TimelineItem {...baseProps} />);
    expect(screen.getByText('AWS')).toBeInTheDocument();
    expect(screen.getByText('Terraform')).toBeInTheDocument();
  });

  it('renders the timeline dot and connecting line when isLast is false', () => {
    const { container } = render(<TimelineItem {...baseProps} isLast={false} />);
    const dot = container.querySelector('.rounded-circle');
    expect(dot).toBeInTheDocument();
    const line = container.querySelector('.bg-gray-100');
    expect(line).toBeInTheDocument();
  });

  it('hides the connecting line when isLast is true', () => {
    const { container } = render(<TimelineItem {...baseProps} isLast={true} />);
    const line = container.querySelector('.bg-gray-100');
    expect(line).not.toBeInTheDocument();
  });
});
