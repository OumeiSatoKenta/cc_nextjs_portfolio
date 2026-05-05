import { render, screen } from '@testing-library/react';
import { ProjectCard } from '@/components/projects/ProjectCard';

const baseProps = {
  title: 'Test Project',
  description: 'A test project description.',
  technologies: ['TypeScript', 'React'],
};

describe('ProjectCard', () => {
  it('renders project title as h3', () => {
    render(<ProjectCard {...baseProps} />);
    expect(screen.getByRole('heading', { level: 3, name: 'Test Project' })).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<ProjectCard {...baseProps} />);
    expect(screen.getByText('A test project description.')).toBeInTheDocument();
  });

  it('renders technology badges', () => {
    render(<ProjectCard {...baseProps} />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('renders technology badges with pill style', () => {
    render(<ProjectCard {...baseProps} />);
    const badge = screen.getByText('TypeScript');
    expect(badge).toHaveClass('rounded-pill', 'bg-badge-blue-bg', 'text-badge-blue-text');
  });

  it('renders GitHub link when provided', () => {
    render(<ProjectCard {...baseProps} githubUrl="https://github.com/test/repo" />);
    const link = screen.getByRole('link', { name: 'GitHub →' });
    expect(link).toHaveAttribute('href', 'https://github.com/test/repo');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders live link with default label when no linkLabel provided', () => {
    render(<ProjectCard {...baseProps} liveUrl="https://example.com" />);
    const link = screen.getByRole('link', { name: 'Live →' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders live link with custom linkLabel', () => {
    render(<ProjectCard {...baseProps} liveUrl="https://example.com" linkLabel="Connpass" />);
    const link = screen.getByRole('link', { name: 'Connpass →' });
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('does not render links section when no URLs provided', () => {
    render(<ProjectCard {...baseProps} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders highlights when provided', () => {
    render(<ProjectCard {...baseProps} highlights={['Highlight one', 'Highlight two']} />);
    expect(screen.getByText('Highlight one')).toBeInTheDocument();
    expect(screen.getByText('Highlight two')).toBeInTheDocument();
  });

  it('does not render highlights section when empty', () => {
    const { container } = render(<ProjectCard {...baseProps} highlights={[]} />);
    expect(container.querySelectorAll('li')).toHaveLength(0);
  });

  it('renders metrics when provided', () => {
    const metrics = [
      { label: '共著者数', value: '70' },
      { label: 'ダウンロード数', value: '16,500' },
    ];
    render(<ProjectCard {...baseProps} metrics={metrics} />);
    expect(screen.getByText('70')).toBeInTheDocument();
    expect(screen.getByText('共著者数')).toBeInTheDocument();
    expect(screen.getByText('16,500')).toBeInTheDocument();
    expect(screen.getByText('ダウンロード数')).toBeInTheDocument();
  });

  it('does not render metrics section when not provided', () => {
    const { container } = render(<ProjectCard {...baseProps} />);
    expect(container.querySelectorAll('dl')).toHaveLength(0);
  });

  it('renders thumbnail when provided', () => {
    const { container } = render(
      <ProjectCard {...baseProps} thumbnail={{ accentColor: 'develop', icon: 'Globe' }} />
    );
    const thumbnail = container.querySelector('[aria-hidden="true"]');
    expect(thumbnail).toBeInTheDocument();
    expect(thumbnail).toHaveClass('bg-gradient-to-br');
  });

  it('does not render thumbnail when not provided', () => {
    const { container } = render(<ProjectCard {...baseProps} />);
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();
  });

  it('does not render thumbnail for unknown icon', () => {
    const { container } = render(
      <ProjectCard {...baseProps} thumbnail={{ accentColor: 'ship', icon: 'UnknownIcon' }} />
    );
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();
  });

  it('renders image thumbnail when image is provided', () => {
    const { container } = render(
      <ProjectCard
        {...baseProps}
        thumbnail={{ accentColor: 'develop', icon: 'Globe', image: '/images/test.png' }}
      />
    );
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('renders icon fallback when image is not provided', () => {
    const { container } = render(
      <ProjectCard {...baseProps} thumbnail={{ accentColor: 'develop', icon: 'Globe' }} />
    );
    expect(container.querySelector('img')).not.toBeInTheDocument();
    expect(container.querySelector('[aria-hidden="true"]')).toHaveClass('bg-gradient-to-br');
  });

  it('renders the metadata pills section when teamSize is provided', () => {
    render(<ProjectCard {...baseProps} teamSize={70} />);
    const region = screen.getByRole('list', { name: 'プロジェクト詳細' });
    expect(region).toBeInTheDocument();
    expect(screen.getByText('チーム 70人')).toBeInTheDocument();
  });

  it('renders the role meta pill when role is provided', () => {
    render(<ProjectCard {...{ ...baseProps, role: '編集' }} />);
    expect(screen.getByText('役割: 編集')).toBeInTheDocument();
  });

  it('renders the userCount meta pill when userCount is provided', () => {
    render(<ProjectCard {...baseProps} userCount="16,500 ダウンロード" />);
    expect(screen.getByText('16,500 ダウンロード')).toBeInTheDocument();
  });

  it('renders all three meta pills together when all fields are provided', () => {
    render(
      <ProjectCard {...{ ...baseProps, teamSize: 70, role: '執筆', userCount: '16,500 DL' }} />
    );
    expect(screen.getByText('チーム 70人')).toBeInTheDocument();
    expect(screen.getByText('役割: 執筆')).toBeInTheDocument();
    expect(screen.getByText('16,500 DL')).toBeInTheDocument();
  });

  it('does not render the metadata pills section when no meta fields are set', () => {
    render(<ProjectCard {...baseProps} />);
    expect(screen.queryByRole('list', { name: 'プロジェクト詳細' })).not.toBeInTheDocument();
  });
});
