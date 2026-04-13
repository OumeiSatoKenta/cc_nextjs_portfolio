import { render, screen } from '@testing-library/react';
import BlogPage from '@/app/blog/page';
import { blogPosts } from '@/data/blog';

describe('BlogPage', () => {
  it('renders h1 with "Blog"', () => {
    render(<BlogPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Blog' })).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<BlogPage />);
    expect(screen.getByText('技術記事・執筆活動')).toBeInTheDocument();
  });

  it('renders all blog post titles from data', () => {
    render(<BlogPage />);
    for (const post of blogPosts) {
      expect(screen.getByText(post.title)).toBeInTheDocument();
    }
  });

  it('renders the correct number of blog card links', () => {
    render(<BlogPage />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(blogPosts.length);
  });

  it('renders all links with target="_blank"', () => {
    render(<BlogPage />);
    const links = screen.getAllByRole('link');
    for (const link of links) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });
});
