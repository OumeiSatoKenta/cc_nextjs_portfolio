import { render, screen, within } from '@testing-library/react';
import { ActivityTimeline } from '@/components/activity/ActivityTimeline';
import type { Activity } from '@/types';

const fixture: Activity[] = [
  {
    id: 'a-2023',
    title: '2023 の活動',
    date: '2023-05',
    category: 'meetup',
    description: 'desc 1',
  },
  {
    id: 'a-2024-jan',
    title: '2024 年 1 月の活動',
    date: '2024-01',
    category: 'publication',
    description: 'desc 2',
  },
  {
    id: 'a-2024-aug',
    title: '2024 年 8 月の活動',
    date: '2024-08',
    category: 'study-group',
    description: 'desc 3',
  },
  {
    id: 'a-2024-year',
    title: '2024 年通年の活動',
    date: '2024',
    category: 'study-group',
    description: 'desc 4',
  },
];

describe('ActivityTimeline', () => {
  it('groups activities by year via section[aria-label]', () => {
    render(<ActivityTimeline activities={fixture} />);
    expect(screen.getByRole('region', { name: '2024 年の活動' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '2023 年の活動' })).toBeInTheDocument();
  });

  it('orders years in descending order in DOM', () => {
    render(<ActivityTimeline activities={fixture} />);
    const yearHeadings = screen.getAllByRole('heading', { level: 2 });
    expect(yearHeadings.map((h) => h.textContent)).toEqual(['2024', '2023']);
  });

  it('orders activities within a year by date desc, with year-only entries last', () => {
    render(<ActivityTimeline activities={fixture} />);
    const section2024 = screen.getByRole('region', { name: '2024 年の活動' });
    const cards = within(section2024).getAllByRole('article');
    // 2024-08 → 2024-01 → 2024 (year-only sorts last because '2024' < '2024-01')
    expect(cards[0]).toHaveTextContent('2024 年 8 月の活動');
    expect(cards[1]).toHaveTextContent('2024 年 1 月の活動');
    expect(cards[2]).toHaveTextContent('2024 年通年の活動');
  });

  it('renders one ActivityCard per activity', () => {
    render(<ActivityTimeline activities={fixture} />);
    expect(screen.getAllByRole('article')).toHaveLength(fixture.length);
  });

  it('renders no sections when activities is empty', () => {
    render(<ActivityTimeline activities={[]} />);
    expect(screen.queryAllByRole('region')).toHaveLength(0);
    expect(screen.queryAllByRole('article')).toHaveLength(0);
  });
});
