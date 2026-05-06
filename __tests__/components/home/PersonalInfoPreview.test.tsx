import { render, screen } from '@testing-library/react';
import { PersonalInfoPreview } from '@/components/home/PersonalInfoPreview';
import type { PersonalInfo } from '@/types';

const baseInfo: PersonalInfo = {
  type: '専門家 × エクスパンダー',
  typeDescription: '深い専門性を軸に、新たな領域へ拡張していくタイプ。',
  topQualities: [
    { title: '論理', description: '論理的に考え、筋道立てて行動する' },
    { title: '着実', description: '一つずつ丁寧に積み上げる' },
    { title: '規律', description: 'プロセスとルールを守る' },
  ],
  selfAwareness: ['再現性のあるプロセスを整える'],
  source: { name: 'アッテル', url: 'https://attelu.jp/' },
};

describe('PersonalInfoPreview', () => {
  it('renders the type as an h3 heading', () => {
    render(<PersonalInfoPreview info={baseInfo} />);
    expect(
      screen.getByRole('heading', { level: 3, name: '専門家 × エクスパンダー' })
    ).toBeInTheDocument();
  });

  it('renders the typeDescription', () => {
    render(<PersonalInfoPreview info={baseInfo} />);
    expect(screen.getByText(baseInfo.typeDescription)).toBeInTheDocument();
  });

  it('renders the source link with target="_blank" and rel="noopener noreferrer"', () => {
    render(<PersonalInfoPreview info={baseInfo} />);
    const link = screen.getByRole('link', { name: 'アッテル' });
    expect(link).toHaveAttribute('href', 'https://attelu.jp/');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders "出典:" prefix and "による適性診断" suffix around the source link', () => {
    render(<PersonalInfoPreview info={baseInfo} />);
    expect(screen.getByText(/出典:/)).toBeInTheDocument();
    expect(screen.getByText(/による適性診断/)).toBeInTheDocument();
  });

  it('does not render the source line when source is undefined', () => {
    const { source: _source, ...rest } = baseInfo;
    render(<PersonalInfoPreview info={rest} />);
    expect(screen.queryByText(/出典:/)).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('does not render top qualities or self-awareness on the home preview (kept brief)', () => {
    render(<PersonalInfoPreview info={baseInfo} />);
    // Home preview displays type-only — top qualities/self-awareness belong to /about
    expect(screen.queryByText('論理')).not.toBeInTheDocument();
    expect(screen.queryByText('再現性のあるプロセスを整える')).not.toBeInTheDocument();
  });
});
