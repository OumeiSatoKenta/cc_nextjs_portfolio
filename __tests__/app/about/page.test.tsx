import { render, screen } from '@testing-library/react';
import AboutPage from '@/app/about/page';
import { careers } from '@/data/career';
import { educations } from '@/data/education';

describe('AboutPage', () => {
  it('renders h1 with "About"', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'About' })).toBeInTheDocument();
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
    expect(screen.getByRole('heading', { level: 3, name: 'Cloud / IaC' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Languages' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Database' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'DevOps / Tools' })).toBeInTheDocument();
  });

  it('renders education titles from data', () => {
    render(<AboutPage />);
    for (const edu of educations) {
      expect(screen.getByText(edu.title)).toBeInTheDocument();
    }
  });

  it('renders the correct number of timeline articles', () => {
    render(<AboutPage />);
    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(careers.length);
  });
});
