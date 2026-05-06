import { render, screen } from '@testing-library/react';
import AboutPage from '@/app/about/page';
import { careers } from '@/data/career';
import { educations } from '@/data/education';
import { siteMetadata } from '@/data/metadata';

describe('AboutPage', () => {
  it('renders h1 with "About"', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'About' })).toBeInTheDocument();
  });

  it('renders Introduction section heading', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { level: 2, name: 'Introduction' })).toBeInTheDocument();
  });

  it('renders the introduction paragraphs from siteMetadata', () => {
    render(<AboutPage />);
    const paragraphs = siteMetadata.author.introduction.split('\n\n');
    for (const paragraph of paragraphs) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
  });

  it('renders Career section heading', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { level: 2, name: 'Career' })).toBeInTheDocument();
  });

  it('renders Skills section heading', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { level: 2, name: 'Skills' })).toBeInTheDocument();
  });

  it('renders Education section heading', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { level: 2, name: 'Education' })).toBeInTheDocument();
  });

  it('renders all career company names from data', () => {
    render(<AboutPage />);
    for (const career of careers) {
      expect(screen.getByText(career.company)).toBeInTheDocument();
    }
  });

  it('renders skill category headings from SkillGrid', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { level: 4, name: 'Cloud / IaC' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'Languages' })).toBeInTheDocument();
    // 'Database' may appear in both 得意領域 and 注力領域 groups
    expect(screen.getAllByRole('heading', { level: 4, name: 'Database' }).length).toBeGreaterThan(
      0
    );
    expect(
      screen.getAllByRole('heading', { level: 4, name: 'DevOps / Tools' }).length
    ).toBeGreaterThan(0);
  });

  it('renders education titles from data', () => {
    render(<AboutPage />);
    for (const edu of educations) {
      expect(screen.getByRole('heading', { level: 3, name: edu.title })).toBeInTheDocument();
    }
  });

  it('renders one timeline article per employer plus one per engagement', () => {
    render(<AboutPage />);
    const articles = screen.getAllByRole('article');
    const expected =
      careers.length + careers.reduce((sum, c) => sum + (c.engagements?.length ?? 0), 0);
    expect(articles).toHaveLength(expected);
  });

  it('renders the StickyNav with all 5 nav items linking to section ids', () => {
    render(<AboutPage />);
    const nav = screen.getByRole('navigation', { name: 'ページ内ナビゲーション' });
    expect(nav).toBeInTheDocument();
    ['intro', 'career', 'skills', 'education', 'personal'].forEach((id) => {
      const links = screen.getAllByRole('link');
      expect(links.some((l) => l.getAttribute('href') === `#${id}`)).toBe(true);
    });
  });

  it('renders Personal section when personalInfo is provided', () => {
    render(<AboutPage />);
    if (siteMetadata.author.personalInfo) {
      expect(screen.getByRole('heading', { level: 2, name: 'Personal' })).toBeInTheDocument();
      expect(screen.getByText(siteMetadata.author.personalInfo.type)).toBeInTheDocument();
    }
  });

  it('renders the Next read navigation section with 3 cards', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { level: 2, name: 'Next read' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'サイドプロジェクト' })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'ブログ' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'お問い合わせ' })).toBeInTheDocument();
  });

  it('marks each section landmark with the expected aria-label', () => {
    render(<AboutPage />);
    expect(screen.getByRole('region', { name: '自己紹介' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '職務経歴' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'スキル' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '学歴・学術研究' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'パーソナル情報' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '次に読む' })).toBeInTheDocument();
  });
});
