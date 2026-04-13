import { render, screen } from '@testing-library/react';
import { Timeline } from '@/components/about/Timeline';
import type { Career } from '@/types';

describe('Timeline', () => {
  const mockCareers: Career[] = [
    {
      company: '会社 A',
      role: 'エンジニア',
      period: { start: '2025-01' },
      description: '概要 A',
      achievements: ['成果 A1'],
      technologies: ['AWS'],
    },
    {
      company: '会社 B',
      role: 'SRE',
      period: { start: '2023-04', end: '2024-12' },
      description: '概要 B',
      achievements: ['成果 B1'],
    },
  ];

  it('renders all career entries', () => {
    render(<Timeline careers={mockCareers} />);
    expect(screen.getByRole('heading', { level: 3, name: '会社 A' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: '会社 B' })).toBeInTheDocument();
  });

  it('applies isLast only to the last item (hides connecting line)', () => {
    const { container } = render(<Timeline careers={mockCareers} />);
    const articles = container.querySelectorAll('article');
    expect(articles).toHaveLength(2);

    const firstLines = articles[0].querySelectorAll('.bg-gray-100');
    expect(firstLines.length).toBe(1);

    const lastLines = articles[1].querySelectorAll('.bg-gray-100');
    expect(lastLines.length).toBe(0);
  });
});
