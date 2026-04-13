import { render, screen } from '@testing-library/react';
import { BlogCard } from '@/components/blog/BlogCard';

const baseProps = {
  title: 'Test Blog Post',
  url: 'https://example.com/post',
  publishedAt: '2025-01-15',
  platform: 'zenn' as const,
};

describe('BlogCard', () => {
  it('renders post title as h3', () => {
    render(<BlogCard {...baseProps} />);
    expect(screen.getByRole('heading', { level: 3, name: 'Test Blog Post' })).toBeInTheDocument();
  });

  it('renders published date with dateTime attribute', () => {
    render(<BlogCard {...baseProps} />);
    const time = screen.getByText('2025年1月15日');
    expect(time).toBeInTheDocument();
    expect(time.tagName).toBe('TIME');
    expect(time).toHaveAttribute('dateTime', '2025-01-15');
  });

  it('renders platform badge', () => {
    render(<BlogCard {...baseProps} />);
    expect(screen.getByText('Zenn')).toBeInTheDocument();
  });

  it('renders platform badge with pill style', () => {
    render(<BlogCard {...baseProps} />);
    const badge = screen.getByText('Zenn');
    expect(badge).toHaveClass('rounded-pill', 'bg-badge-blue-bg', 'text-badge-blue-text');
  });

  it('renders as article with external link at bottom', () => {
    const { container } = render(<BlogCard {...baseProps} />);
    expect(container.querySelector('article')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'Zennで読む →' });
    expect(link).toHaveAttribute('href', 'https://example.com/post');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders description when provided', () => {
    render(<BlogCard {...baseProps} description="A great article about testing." />);
    expect(screen.getByText('A great article about testing.')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    const { container } = render(<BlogCard {...baseProps} />);
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(0);
  });

  it('renders tags when provided', () => {
    render(<BlogCard {...baseProps} tags={['React', 'TypeScript']} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('does not render tags section when tags is empty', () => {
    const { container } = render(<BlogCard {...baseProps} tags={[]} />);
    const tagBadges = container.querySelectorAll('.flex.flex-wrap');
    expect(tagBadges).toHaveLength(0);
  });

  it('renders correct label for each platform', () => {
    const { rerender } = render(<BlogCard {...baseProps} platform="qiita" />);
    expect(screen.getByText('Qiita')).toBeInTheDocument();

    rerender(<BlogCard {...baseProps} platform="note" />);
    expect(screen.getByText('note')).toBeInTheDocument();

    rerender(<BlogCard {...baseProps} platform="amazon" />);
    expect(screen.getByText('Amazon Kindle')).toBeInTheDocument();

    rerender(<BlogCard {...baseProps} platform="other" />);
    expect(screen.getByText('Other')).toBeInTheDocument();
  });
});
