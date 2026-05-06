import { render, screen, within } from '@testing-library/react';
import HomePage from '@/app/page';
import { blogPosts } from '@/data/blog';
import { careerOverview } from '@/data/career';
import { siteMetadata } from '@/data/metadata';
import { projects } from '@/data/projects';

describe('HomePage', () => {
  it('renders the author name as the h1 heading', () => {
    render(<HomePage />);
    const heading = screen.getByRole('heading', {
      level: 1,
      name: siteMetadata.author.name,
    });
    expect(heading).toBeInTheDocument();
  });

  it('renders the tagline from siteMetadata', () => {
    render(<HomePage />);
    expect(screen.getByText(siteMetadata.author.tagline)).toBeInTheDocument();
  });

  it('renders one StrengthCard article per strength inside the strengths section', () => {
    render(<HomePage />);
    const strengthsSection = screen.getByRole('region', { name: '強み' });
    const articles = within(strengthsSection).getAllByRole('article');
    expect(articles).toHaveLength(siteMetadata.author.strengths.length);
  });

  it('renders each strength title as an h3 heading', () => {
    render(<HomePage />);
    siteMetadata.author.strengths.forEach((strength) => {
      expect(screen.getByRole('heading', { level: 3, name: strength.title })).toBeInTheDocument();
    });
  });

  it('renders a primary CTA link to /about/', () => {
    render(<HomePage />);
    const heroSection = screen.getByRole('region', { name: 'ヒーロー' });
    const link = within(heroSection).getByRole('link', { name: '経歴・スキルを見る' });
    expect(link.getAttribute('href')).toMatch(/^\/about\/?$/);
  });

  it('renders each stat value from siteMetadata.author.stats', () => {
    render(<HomePage />);
    siteMetadata.author.stats.forEach((stat) => {
      expect(screen.getByText(stat.value)).toBeInTheDocument();
    });
  });

  it('renders a secondary CTA link to /projects/', () => {
    render(<HomePage />);
    const heroSection = screen.getByRole('region', { name: 'ヒーロー' });
    const link = within(heroSection).getByRole('link', { name: 'サイドプロジェクトを見る' });
    expect(link.getAttribute('href')).toMatch(/^\/projects\/?$/);
  });

  it('renders the Career preview section with link to /about/', () => {
    render(<HomePage />);
    const careerSection = screen.getByRole('region', { name: '経歴' });
    expect(
      within(careerSection).getByRole('heading', { level: 2, name: 'Career' })
    ).toBeInTheDocument();
    const link = within(careerSection).getByRole('link', { name: '経歴を詳しく見る →' });
    expect(link.getAttribute('href')).toMatch(/^\/about\/?$/);
    // Home page shows employer-level overview (シャノン → オルトプラス)
    expect(within(careerSection).getAllByRole('heading', { level: 3 })).toHaveLength(
      careerOverview.length
    );
  });

  it('renders the Skills preview section with link to /about/', () => {
    render(<HomePage />);
    const skillsSection = screen.getByRole('region', { name: 'スキルプレビュー' });
    expect(
      within(skillsSection).getByRole('heading', { level: 2, name: 'Skills' })
    ).toBeInTheDocument();
    const link = within(skillsSection).getByRole('link', { name: 'スキルを詳しく見る →' });
    expect(link.getAttribute('href')).toMatch(/^\/about\/?$/);
  });

  it('renders the Featured Projects section with featured project headings only', () => {
    render(<HomePage />);
    const projectsSection = screen.getByRole('region', { name: 'Featured プロジェクト' });
    expect(
      within(projectsSection).getByRole('heading', { level: 2, name: 'Featured Projects' })
    ).toBeInTheDocument();
    const link = within(projectsSection).getByRole('link', {
      name: 'すべてのプロジェクトを見る →',
    });
    expect(link.getAttribute('href')).toMatch(/^\/projects\/?$/);

    const featured = projects.filter((p) => p.featured);
    expect(within(projectsSection).getAllByRole('article')).toHaveLength(featured.length);
  });

  it('renders the Latest Posts section with link to /blog/', () => {
    render(<HomePage />);
    const blogSection = screen.getByRole('region', { name: '最新ブログ' });
    expect(
      within(blogSection).getByRole('heading', { level: 2, name: 'Latest Posts' })
    ).toBeInTheDocument();
    const link = within(blogSection).getByRole('link', { name: 'すべての記事を見る →' });
    expect(link.getAttribute('href')).toMatch(/^\/blog\/?$/);
    expect(within(blogSection).getAllByRole('article')).toHaveLength(Math.min(3, blogPosts.length));
  });

  it('renders the Activity preview section with link to /activity/', () => {
    render(<HomePage />);
    const activitySection = screen.getByRole('region', { name: '活動プレビュー' });
    expect(
      within(activitySection).getByRole('heading', { level: 2, name: 'Activity' })
    ).toBeInTheDocument();
    const link = within(activitySection).getByRole('link', { name: 'すべての活動を見る →' });
    expect(link.getAttribute('href')).toMatch(/^\/activity\/?$/);
    expect(within(activitySection).getAllByRole('listitem').length).toBeGreaterThanOrEqual(1);
  });
});
