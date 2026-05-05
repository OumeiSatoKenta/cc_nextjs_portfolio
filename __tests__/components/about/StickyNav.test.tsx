import { render, screen } from '@testing-library/react';
import { StickyNav } from '@/components/about/StickyNav';

const items = [
  { id: 'intro', label: 'イントロ' },
  { id: 'career', label: 'キャリア' },
  { id: 'skills', label: 'スキル' },
];

describe('StickyNav', () => {
  it('renders a nav with the page-internal navigation aria-label', () => {
    render(<StickyNav items={items} />);
    expect(screen.getByRole('navigation', { name: 'ページ内ナビゲーション' })).toBeInTheDocument();
  });

  it('renders an anchor link for each item with #id href', () => {
    render(<StickyNav items={items} />);
    items.forEach((item) => {
      const link = screen.getByRole('link', { name: item.label });
      expect(link).toHaveAttribute('href', `#${item.id}`);
    });
  });

  it('marks the first item as aria-current=location on initial load (before scroll)', () => {
    render(<StickyNav items={items} />);
    const firstLink = screen.getByRole('link', { name: 'イントロ' });
    expect(firstLink).toHaveAttribute('aria-current', 'location');
  });

  it('does not mark non-active items with aria-current', () => {
    render(<StickyNav items={items} />);
    const careerLink = screen.getByRole('link', { name: 'キャリア' });
    expect(careerLink).not.toHaveAttribute('aria-current');
  });

  it('renders nothing inside the list when items is empty', () => {
    render(<StickyNav items={[]} />);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });
});
