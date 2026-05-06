import { render, screen } from '@testing-library/react';
import { ActivityPreview } from '@/components/home/ActivityPreview';
import type { Activity } from '@/types';

const fixture: Activity[] = [
  {
    id: 'a1',
    title: '最新の活動',
    date: '2025-03',
    category: 'meetup',
    description: 'd1',
  },
  {
    id: 'a2',
    title: '2 番目',
    date: '2024-08',
    category: 'publication',
    description: 'd2',
  },
  {
    id: 'a3',
    title: '3 番目',
    date: '2024-01',
    category: 'study-group',
    description: 'd3',
  },
  {
    id: 'a4',
    title: '4 番目',
    date: '2023-05',
    category: 'meetup',
    description: 'd4',
  },
];

describe('ActivityPreview', () => {
  it('renders the latest 3 activities by default in date desc order', () => {
    render(<ActivityPreview activities={fixture} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('最新の活動');
    expect(items[1]).toHaveTextContent('2 番目');
    expect(items[2]).toHaveTextContent('3 番目');
  });

  it('respects a custom limit', () => {
    render(<ActivityPreview activities={fixture} limit={2} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders the year extracted from date as the timestamp', () => {
    render(<ActivityPreview activities={fixture} limit={1} />);
    const time = screen.getByText('2025');
    expect(time.tagName).toBe('TIME');
    expect(time).toHaveAttribute('datetime', '2025-03');
  });

  it('renders the Japanese category label as a badge', () => {
    render(<ActivityPreview activities={fixture} limit={1} />);
    expect(screen.getByText('ミートアップ')).toBeInTheDocument();
  });

  it('appends "〜 現在" to the year when ongoing is true', () => {
    render(<ActivityPreview activities={[{ ...fixture[0], ongoing: true }]} limit={1} />);
    const time = screen.getByText('2025 〜 現在');
    expect(time.tagName).toBe('TIME');
  });
});
