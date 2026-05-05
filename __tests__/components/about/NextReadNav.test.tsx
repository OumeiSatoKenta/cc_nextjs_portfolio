import { render, screen } from '@testing-library/react';
import { NextReadNav } from '@/components/about/NextReadNav';

const cards = [
  { href: '/projects/', title: 'サイドプロジェクト', description: '個人開発・技術書' },
  { href: '/blog/', title: 'ブログ', description: '技術記事' },
  { href: '/contact/', title: 'お問い合わせ', description: '連絡先' },
];

describe('NextReadNav', () => {
  it('renders one link per card pointing to its href', () => {
    render(<NextReadNav cards={cards} />);
    cards.forEach((card) => {
      const link = screen.getByRole('link', { name: new RegExp(card.title) });
      expect(link.getAttribute('href')).toMatch(new RegExp(`^${card.href.replace('/', '\\/')}?$`));
    });
  });

  it('renders each card title as an h3 heading', () => {
    render(<NextReadNav cards={cards} />);
    cards.forEach((card) => {
      expect(screen.getByRole('heading', { level: 3, name: card.title })).toBeInTheDocument();
    });
  });

  it('renders each card description', () => {
    render(<NextReadNav cards={cards} />);
    cards.forEach((card) => {
      expect(screen.getByText(card.description)).toBeInTheDocument();
    });
  });

  it('renders a "詳しく見る" call-to-action on each card', () => {
    render(<NextReadNav cards={cards} />);
    expect(screen.getAllByText('詳しく見る')).toHaveLength(cards.length);
  });

  it('renders nothing when cards is empty', () => {
    render(<NextReadNav cards={[]} />);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });
});
