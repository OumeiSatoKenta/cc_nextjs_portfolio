import { render, screen } from '@testing-library/react';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import type { Project } from '@/types';

const projects: Project[] = [
  {
    id: 'a',
    title: 'Featured A',
    description: 'first featured',
    technologies: ['Next.js'],
    featured: true,
  },
  {
    id: 'b',
    title: 'Not Featured',
    description: 'should be hidden',
    technologies: ['Node.js'],
    featured: false,
  },
  {
    id: 'c',
    title: 'Featured C',
    description: 'second featured',
    technologies: ['Terraform'],
    featured: true,
  },
];

describe('FeaturedProjects', () => {
  it('renders only projects with featured=true', () => {
    render(<FeaturedProjects projects={projects} />);
    expect(screen.getByRole('heading', { level: 3, name: 'Featured A' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Featured C' })).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { level: 3, name: 'Not Featured' })
    ).not.toBeInTheDocument();
  });

  it('preserves the input order of featured projects', () => {
    render(<FeaturedProjects projects={projects} />);
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings.map((h) => h.textContent)).toEqual(['Featured A', 'Featured C']);
  });

  it('renders nothing when no projects are featured', () => {
    const noneFeatured = projects.map((p) => ({ ...p, featured: false }));
    render(<FeaturedProjects projects={noneFeatured} />);
    expect(screen.queryAllByRole('article')).toHaveLength(0);
  });
});
