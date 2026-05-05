import { render, screen } from '@testing-library/react';
import { SkillGrid } from '@/components/about/SkillGrid';
import type { Skill } from '@/types';

describe('SkillGrid', () => {
  const mockSkills: Skill[] = [
    { name: 'AWS', category: 'cloud', level: 'expert', years: 3, icon: 'Cloud' },
    { name: 'Terraform', category: 'cloud', level: 'advanced', years: 2, icon: 'Boxes' },
    { name: 'Python', category: 'language', level: 'intermediate', years: 4, icon: 'Code' },
    { name: 'Aurora MySQL', category: 'database', level: 'advanced', years: 3, icon: 'Database' },
    { name: 'Docker', category: 'tool', level: 'advanced', years: 4, icon: 'Container' },
  ];

  it('renders the strong/growing top-level group headings', () => {
    render(<SkillGrid skills={mockSkills} />);
    expect(screen.getByRole('heading', { level: 3, name: '得意領域' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: '成長中' })).toBeInTheDocument();
  });

  it('renders category sub-headings as h4', () => {
    render(<SkillGrid skills={mockSkills} />);
    expect(screen.getByRole('heading', { level: 4, name: 'Cloud / IaC' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'Languages' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'Database' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'DevOps / Tools' })).toBeInTheDocument();
  });

  it('renders skill names with years', () => {
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

  it('omits the strong group when no expert/advanced skills exist', () => {
    const intermediateOnly: Skill[] = [{ name: 'Go', category: 'language', level: 'intermediate' }];
    render(<SkillGrid skills={intermediateOnly} />);
    expect(screen.queryByRole('heading', { level: 3, name: '得意領域' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: '成長中' })).toBeInTheDocument();
  });

  it('omits the growing group when no intermediate/beginner skills exist', () => {
    const expertOnly: Skill[] = [{ name: 'AWS', category: 'cloud', level: 'expert' }];
    render(<SkillGrid skills={expertOnly} />);
    expect(screen.getByRole('heading', { level: 3, name: '得意領域' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 3, name: '成長中' })).not.toBeInTheDocument();
  });

  it('classifies a skill without level into the growing group', () => {
    const noLevel: Skill[] = [{ name: 'Rust', category: 'language' }];
    render(<SkillGrid skills={noLevel} />);
    expect(screen.queryByRole('heading', { level: 3, name: '得意領域' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: '成長中' })).toBeInTheDocument();
    expect(screen.getByText('Rust')).toBeInTheDocument();
  });

  it('renders the description as a caption when set', () => {
    const withDesc: Skill[] = [
      {
        name: 'AWS',
        category: 'cloud',
        level: 'expert',
        description: 'VPC / ECS の設計',
      },
    ];
    render(<SkillGrid skills={withDesc} />);
    expect(screen.getByText('VPC / ECS の設計')).toBeInTheDocument();
  });

  it('does not render any description text when description is not set', () => {
    const skillsWithoutDesc: Skill[] = [{ name: 'AWS', category: 'cloud', level: 'expert' }];
    const { container } = render(<SkillGrid skills={skillsWithoutDesc} />);
    expect(container.querySelectorAll('p')).toHaveLength(0);
  });

  it('omits categories with no skills inside the strong group', () => {
    const cloudExpertOnly: Skill[] = [{ name: 'AWS', category: 'cloud', level: 'expert' }];
    render(<SkillGrid skills={cloudExpertOnly} />);
    expect(screen.getByRole('heading', { level: 4, name: 'Cloud / IaC' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 4, name: 'Languages' })).not.toBeInTheDocument();
  });
});
