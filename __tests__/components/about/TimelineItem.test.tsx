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

  it('renders teamSize badge when teamSize is provided', () => {
    render(<TimelineItem {...baseProps} teamSize={5} />);
    expect(screen.getByText('チーム 5人')).toBeInTheDocument();
  });

  it('renders all roleType labels when multiple types are provided', () => {
    render(
      <TimelineItem
        {...baseProps}
        roleType={['design', 'implementation', 'management', 'operations']}
      />
    );
    expect(screen.getByText('設計')).toBeInTheDocument();
    expect(screen.getByText('実装')).toBeInTheDocument();
    expect(screen.getByText('マネジメント')).toBeInTheDocument();
    expect(screen.getByText('運用')).toBeInTheDocument();
  });

  it('applies category-specific badge color to each roleType label', () => {
    render(<TimelineItem {...baseProps} roleType={['design', 'implementation']} />);
    expect(screen.getByText('設計')).toHaveClass('bg-badge-cloud-bg', 'text-badge-cloud-text');
    expect(screen.getByText('実装')).toHaveClass('bg-badge-lang-bg', 'text-badge-lang-text');
  });

  it('does not render the role meta section when neither teamSize nor roleType is set', () => {
    render(<TimelineItem {...baseProps} />);
    expect(screen.queryByRole('list', { name: 'チーム規模・役割種別' })).not.toBeInTheDocument();
  });

  it('renders only roleType badges when teamSize is omitted', () => {
    render(<TimelineItem {...baseProps} roleType={['operations']} />);
    expect(screen.getByText('運用')).toBeInTheDocument();
    expect(screen.queryByText(/^チーム/)).not.toBeInTheDocument();
  });
});
