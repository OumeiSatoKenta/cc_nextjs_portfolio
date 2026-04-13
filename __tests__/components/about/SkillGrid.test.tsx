import { render, screen } from '@testing-library/react';
import { SkillGrid } from '@/components/about/SkillGrid';
import type { Skill } from '@/types';

describe('SkillGrid', () => {
  const mockSkills: Skill[] = [
    { name: 'AWS', category: 'cloud', level: 'expert' },
    { name: 'Terraform', category: 'cloud', level: 'advanced' },
    { name: 'Python', category: 'language', level: 'intermediate' },
    { name: 'Aurora MySQL', category: 'database', level: 'advanced' },
    { name: 'Docker', category: 'tool', level: 'advanced' },
  ];

  it('renders category headings', () => {
    render(<SkillGrid skills={mockSkills} />);
    expect(screen.getByRole('heading', { level: 3, name: 'Cloud / IaC' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Languages' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Database' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'DevOps / Tools' })).toBeInTheDocument();
  });

  it('renders all skill names', () => {
    render(<SkillGrid skills={mockSkills} />);
    expect(screen.getByText('AWS')).toBeInTheDocument();
    expect(screen.getByText('Terraform')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Aurora MySQL')).toBeInTheDocument();
    expect(screen.getByText('Docker')).toBeInTheDocument();
  });

  it('applies dark badge class for expert level skills', () => {
    render(<SkillGrid skills={mockSkills} />);
    const awsBadge = screen.getByText('AWS');
    expect(awsBadge).toHaveClass('bg-vercel-black', 'text-pure-white');
  });

  it('applies gray badge class for advanced level skills', () => {
    render(<SkillGrid skills={mockSkills} />);
    const terraformBadge = screen.getByText('Terraform');
    expect(terraformBadge).toHaveClass('bg-gray-100', 'text-vercel-black');
  });

  it('applies default badge class for intermediate level skills', () => {
    render(<SkillGrid skills={mockSkills} />);
    const pythonBadge = screen.getByText('Python');
    expect(pythonBadge).toHaveClass('bg-badge-blue-bg', 'text-badge-blue-text');
  });

  it('omits categories with no skills', () => {
    const cloudOnly: Skill[] = [{ name: 'AWS', category: 'cloud', level: 'expert' }];
    render(<SkillGrid skills={cloudOnly} />);
    expect(screen.getByText('Cloud / IaC')).toBeInTheDocument();
    expect(screen.queryByText('Languages')).not.toBeInTheDocument();
  });
});
