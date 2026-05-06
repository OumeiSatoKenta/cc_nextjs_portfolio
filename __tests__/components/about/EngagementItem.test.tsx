import { render, screen } from '@testing-library/react';
import { EngagementItem } from '@/components/about/EngagementItem';
import type { CareerEngagement } from '@/types';

const baseEngagement: CareerEngagement = {
  client: 'テストクライアント',
  engagementType: 'ses',
  role: 'SRE エンジニア',
  period: { start: '2024-01', end: '2024-12' },
  description: 'テスト用案件説明',
  achievements: ['成果 1', '成果 2'],
  technologies: ['AWS', 'Terraform'],
};

describe('EngagementItem', () => {
  it('renders the client name as an h4 heading', () => {
    render(<EngagementItem engagement={baseEngagement} isLast={false} />);
    expect(
      screen.getByRole('heading', { level: 4, name: baseEngagement.client })
    ).toBeInTheDocument();
  });

  it('renders SES badge with label "SES"', () => {
    render(<EngagementItem engagement={baseEngagement} isLast={false} />);
    expect(screen.getByText('SES')).toBeInTheDocument();
  });

  it('renders in-house badge with label "自社開発"', () => {
    render(
      <EngagementItem
        engagement={{ ...baseEngagement, engagementType: 'in-house' }}
        isLast={false}
      />
    );
    expect(screen.getByText('自社開発')).toBeInTheDocument();
  });

  it('renders the period in a time element', () => {
    render(<EngagementItem engagement={baseEngagement} isLast={false} />);
    expect(screen.getByText('2024-01 — 2024-12').tagName).toBe('TIME');
  });

  it('shows "現在" when period.end is undefined', () => {
    render(
      <EngagementItem
        engagement={{ ...baseEngagement, period: { start: '2026-02' } }}
        isLast={false}
      />
    );
    expect(screen.getByText('2026-02 — 現在')).toBeInTheDocument();
  });

  it('renders achievements as list items', () => {
    render(<EngagementItem engagement={baseEngagement} isLast={false} />);
    expect(screen.getByText('成果 1')).toBeInTheDocument();
    expect(screen.getByText('成果 2')).toBeInTheDocument();
  });

  it('renders technologies as badges', () => {
    render(<EngagementItem engagement={baseEngagement} isLast={false} />);
    expect(screen.getByText('AWS')).toBeInTheDocument();
    expect(screen.getByText('Terraform')).toBeInTheDocument();
  });

  it('hides the connecting line when isLast is true', () => {
    const { container } = render(<EngagementItem engagement={baseEngagement} isLast={true} />);
    expect(container.querySelector('.bg-gray-100')).not.toBeInTheDocument();
  });

  it('renders teamSize badge when provided', () => {
    render(<EngagementItem engagement={{ ...baseEngagement, teamSize: 1 }} isLast={false} />);
    expect(screen.getByText('チーム 1人')).toBeInTheDocument();
  });
});
