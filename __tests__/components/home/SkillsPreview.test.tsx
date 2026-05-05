import { render, screen } from '@testing-library/react';
import { SkillsPreview } from '@/components/home/SkillsPreview';
import type { Skill } from '@/types';

const skills: Skill[] = [
  { name: 'AWS', category: 'cloud', level: 'expert' },
  { name: 'Terraform', category: 'cloud', level: 'advanced' },
  { name: 'Python', category: 'language', level: 'intermediate' },
  { name: 'Bash', category: 'language', level: 'beginner' },
  { name: 'Docker', category: 'tool', level: 'advanced' },
];

describe('SkillsPreview', () => {
  it('renders only expert and advanced skills', () => {
    render(<SkillsPreview skills={skills} />);
    expect(screen.getByText('AWS')).toBeInTheDocument();
    expect(screen.getByText('Terraform')).toBeInTheDocument();
    expect(screen.getByText('Docker')).toBeInTheDocument();
    expect(screen.queryByText('Python')).not.toBeInTheDocument();
    expect(screen.queryByText('Bash')).not.toBeInTheDocument();
  });

  it('renders expert skills with cloud badge color tokens', () => {
    render(<SkillsPreview skills={skills} />);
    const aws = screen.getByText('AWS');
    expect(aws).toHaveClass('bg-badge-cloud-bg', 'text-badge-cloud-text');
  });

  it('renders advanced skills with tool badge color tokens', () => {
    render(<SkillsPreview skills={skills} />);
    const tf = screen.getByText('Terraform');
    expect(tf).toHaveClass('bg-badge-tool-bg', 'text-badge-tool-text');
  });

  it('preserves the input order of skills', () => {
    render(<SkillsPreview skills={skills} />);
    const items = screen.getAllByRole('listitem');
    expect(items.map((li) => li.textContent)).toEqual(['AWS', 'Terraform', 'Docker']);
  });

  it('renders an empty list when no expert or advanced skills exist', () => {
    const noneRelevant: Skill[] = [{ name: 'Go', category: 'language', level: 'intermediate' }];
    render(<SkillsPreview skills={noneRelevant} />);
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
