import { render, screen } from '@testing-library/react';
import ProjectsPage from '@/app/projects/page';
import { projects } from '@/data/projects';

describe('ProjectsPage', () => {
  it('renders h1 with "Projects"', () => {
    render(<ProjectsPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Projects' })).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<ProjectsPage />);
    expect(screen.getByText('公開プロジェクト一覧')).toBeInTheDocument();
  });

  it('renders all project titles from data', () => {
    render(<ProjectsPage />);
    for (const project of projects) {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    }
  });

  it('renders the correct number of project cards', () => {
    render(<ProjectsPage />);
    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(projects.length);
  });

  it('renders GitHub links for projects with githubUrl', () => {
    render(<ProjectsPage />);
    const githubLinks = screen.getAllByRole('link', { name: 'GitHub →' });
    const projectsWithGithub = projects.filter((p) => p.githubUrl);
    expect(githubLinks).toHaveLength(projectsWithGithub.length);
  });
});
