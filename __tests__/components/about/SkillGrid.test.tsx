import { render, screen } from '@testing-library/react';
import { SkillGrid } from '@/components/about/SkillGrid';
import type { Skill } from '@/types';

describe('SkillGrid', () => {
  const mockSkills: Skill[] = [
    { name: 'AWS', category: 'cloud', level: 'expert', years: 3 },
    { name: 'Terraform', category: 'cloud', level: 'advanced', years: 2 },
    { name: 'Python', category: 'language', level: 'intermediate', years: 4 },
    { name: 'Aurora MySQL', category: 'database', level: 'advanced', years: 3 },
    { name: 'Docker', category: 'tool', level: 'advanced', years: 4 },
  ];

  it('renders category headings', () => {
    render(<SkillGrid skills={mockSkills} />);
    expect(screen.getByRole('heading', { level: 3, name: 'Cloud / IaC' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Languages' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Database' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'DevOps / Tools' })).toBeInTheDocument();
  });

  it('renders all skill names with years', () => {
    render(<SkillGrid skills={mockSkills} />);
    expect(screen.getByText('AWS · 3年')).toBeInTheDocument();
    expect(screen.getByText('Terraform · 2年')).toBeInTheDocument();
    expect(screen.getByText('Python · 4年')).toBeInTheDocument();
    expect(screen.getByText('Aurora MySQL · 3年')).toBeInTheDocument();
    expect(screen.getByText('Docker · 4年')).toBeInTheDocument();
  });

  it('renders skill name without years when years is not set', () => {
    const skillsWithoutYears: Skill[] = [
      { name: 'Go', category: 'language', level: 'intermediate' },
    ];
    render(<SkillGrid skills={skillsWithoutYears} />);
    expect(screen.getByText('Go')).toBeInTheDocument();
  });

  it('applies dark badge class for expert level skills', () => {
    render(<SkillGrid skills={mockSkills} />);
    const awsBadge = screen.getByText('AWS · 3年');
    expect(awsBadge).toHaveClass('bg-vercel-black', 'text-pure-white');
  });

  it('applies gray badge class for advanced level skills', () => {
    render(<SkillGrid skills={mockSkills} />);
    const terraformBadge = screen.getByText('Terraform · 2年');
    expect(terraformBadge).toHaveClass('bg-gray-100', 'text-vercel-black');
  });

  it('applies default badge class for intermediate level skills', () => {
    render(<SkillGrid skills={mockSkills} />);
    const pythonBadge = screen.getByText('Python · 4年');
    expect(pythonBadge).toHaveClass('bg-badge-blue-bg', 'text-badge-blue-text');
  });

  it('omits categories with no skills', () => {
    const cloudOnly: Skill[] = [{ name: 'AWS', category: 'cloud', level: 'expert', years: 3 }];
    render(<SkillGrid skills={cloudOnly} />);
    expect(screen.getByText('Cloud / IaC')).toBeInTheDocument();
    expect(screen.queryByText('Languages')).not.toBeInTheDocument();
  });
});
