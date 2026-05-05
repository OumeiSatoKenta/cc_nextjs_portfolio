import { render, screen } from '@testing-library/react';
import { LatestBlog } from '@/components/home/LatestBlog';
import type { BlogPost } from '@/types';

const posts: BlogPost[] = [
  {
    title: 'Old Post',
    url: 'https://example.com/old',
    publishedAt: '2024-01-01',
    platform: 'zenn',
  },
  {
    title: 'Newest Post',
    url: 'https://example.com/newest',
    publishedAt: '2026-04-01',
    platform: 'zenn',
  },
  {
    title: 'Middle Post',
    url: 'https://example.com/middle',
    publishedAt: '2025-06-15',
    platform: 'qiita',
  },
  {
    title: 'Older Post',
    url: 'https://example.com/older',
    publishedAt: '2023-05-10',
    platform: 'note',
  },
];

describe('LatestBlog', () => {
  it('renders the 3 most recent posts by default in descending order', () => {
    render(<LatestBlog posts={posts} />);
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings.map((h) => h.textContent)).toEqual(['Newest Post', 'Middle Post', 'Old Post']);
  });

  it('respects the limit prop', () => {
    render(<LatestBlog posts={posts} limit={2} />);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
  });

  it('renders all posts when total count is below the limit', () => {
    render(<LatestBlog posts={posts.slice(0, 2)} />);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
  });

  it('does not mutate the source array', () => {
    const original = [...posts];
    render(<LatestBlog posts={posts} />);
    expect(posts.map((p) => p.url)).toEqual(original.map((p) => p.url));
  });

  it('renders nothing when posts is empty', () => {
    render(<LatestBlog posts={[]} />);
    expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(0);
  });
});
