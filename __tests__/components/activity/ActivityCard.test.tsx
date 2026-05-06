import { render, screen } from '@testing-library/react';
import { ActivityCard } from '@/components/activity/ActivityCard';
import type { Activity } from '@/types';

const baseActivity: Activity = {
  id: 'test-activity',
  title: 'テスト活動タイトル',
  date: '2024-08',
  category: 'meetup',
  description: 'テスト用の活動説明文。',
};

describe('ActivityCard', () => {
  it('renders the title as an h3 heading', () => {
    render(<ActivityCard activity={baseActivity} />);
    expect(screen.getByRole('heading', { level: 3, name: baseActivity.title })).toBeInTheDocument();
  });

  it('renders the date as a <time> element with dateTime attribute', () => {
    render(<ActivityCard activity={baseActivity} />);
    const time = screen.getByText('2024 年 8 月');
    expect(time.tagName).toBe('TIME');
    expect(time).toHaveAttribute('datetime', '2024-08');
  });

  it('formats year-only dates as "YYYY 年"', () => {
    render(<ActivityCard activity={{ ...baseActivity, date: '2024' }} />);
    const time = screen.getByText('2024 年');
    expect(time.tagName).toBe('TIME');
    expect(time).toHaveAttribute('datetime', '2024');
  });

  it('formats full ISO dates as "YYYY 年 M 月 D 日"', () => {
    render(<ActivityCard activity={{ ...baseActivity, date: '2024-08-15' }} />);
    expect(screen.getByText('2024 年 8 月 15 日')).toBeInTheDocument();
  });

  it.each([
    ['meetup', 'ミートアップ', 'bg-badge-cloud-bg'],
    ['conference', 'カンファレンス', 'bg-badge-db-bg'],
    ['study-group', '勉強会', 'bg-badge-lang-bg'],
    ['publication', '出版', 'bg-vercel-black'],
    ['oss', 'OSS', 'bg-badge-tool-bg'],
    ['other', 'その他', 'bg-badge-tool-bg'],
  ] as const)('renders %s category with label "%s" and class "%s"', (category, label, className) => {
    render(<ActivityCard activity={{ ...baseActivity, category }} />);
    const badge = screen.getByText(label);
    expect(badge).toHaveClass(className);
  });

  it('renders description text', () => {
    render(<ActivityCard activity={baseActivity} />);
    expect(screen.getByText(baseActivity.description)).toBeInTheDocument();
  });

  it('renders role badge when role is provided', () => {
    render(<ActivityCard activity={{ ...baseActivity, role: '運営メンバー' }} />);
    expect(screen.getByText('運営メンバー')).toBeInTheDocument();
  });

  it('does not render role badge when role is omitted', () => {
    render(<ActivityCard activity={baseActivity} />);
    expect(screen.queryByText('運営メンバー')).not.toBeInTheDocument();
  });

  it('renders external link with target="_blank" and rel="noopener noreferrer" when url is provided', () => {
    render(<ActivityCard activity={{ ...baseActivity, url: 'https://example.com/event' }} />);
    const link = screen.getByRole('link', { name: /詳しく見る/ });
    expect(link).toHaveAttribute('href', 'https://example.com/event');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not render link when url is omitted', () => {
    render(<ActivityCard activity={baseActivity} />);
    expect(screen.queryByRole('link', { name: /詳しく見る/ })).not.toBeInTheDocument();
  });

  it('renders tags when tags are provided', () => {
    render(<ActivityCard activity={{ ...baseActivity, tags: ['TiDB', 'コミュニティ'] }} />);
    expect(screen.getByText('TiDB')).toBeInTheDocument();
    expect(screen.getByText('コミュニティ')).toBeInTheDocument();
  });

  it('appends "〜 現在" to the date label when ongoing is true', () => {
    render(<ActivityCard activity={{ ...baseActivity, ongoing: true }} />);
    const time = screen.getByText('2024 年 8 月 〜 現在');
    expect(time.tagName).toBe('TIME');
    expect(time).toHaveAttribute('datetime', '2024-08');
  });

  it('does not append "〜 現在" when ongoing is false or omitted', () => {
    render(<ActivityCard activity={baseActivity} />);
    expect(screen.queryByText(/〜 現在/)).not.toBeInTheDocument();
  });

  it('renders nothing in the tag section when tags array is empty', () => {
    const { container } = render(<ActivityCard activity={{ ...baseActivity, tags: [] }} />);
    // No tag pill spans should appear (only category badge)
    const tagPills = container.querySelectorAll('.bg-badge-blue-bg');
    expect(tagPills).toHaveLength(0);
  });
});
