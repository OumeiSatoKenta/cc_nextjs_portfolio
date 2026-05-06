import { render, screen } from '@testing-library/react';
import ActivityPage, { metadata } from '@/app/activity/page';
import { activities } from '@/data/activities';

describe('ActivityPage', () => {
  it('exposes Japanese metadata', () => {
    expect(metadata.title).toBe('活動履歴');
    expect(metadata.description).toMatch(/活動/);
  });

  it('renders "活動履歴" as the h1 heading', () => {
    render(<ActivityPage />);
    expect(screen.getByRole('heading', { level: 1, name: '活動履歴' })).toBeInTheDocument();
  });

  it('renders one ActivityCard article per activity entry', () => {
    render(<ActivityPage />);
    expect(screen.getAllByRole('article')).toHaveLength(activities.length);
  });

  it('renders the activity hero section landmark', () => {
    render(<ActivityPage />);
    expect(screen.getByRole('region', { name: '活動履歴' })).toBeInTheDocument();
  });
});
