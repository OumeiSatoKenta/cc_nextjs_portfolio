import { render, screen } from '@testing-library/react';
import { PersonalInfoSection } from '@/components/about/PersonalInfoSection';
import type { PersonalInfo } from '@/types';

const info: PersonalInfo = {
  type: '専門家 × エクスパンダー',
  typeDescription: '専門性を内省的に追求するタイプ',
  topQualities: [
    { title: '論理', description: '客観的に評価する' },
    { title: '着実', description: '粘り強く進める' },
    { title: '規律', description: 'ルールを定める' },
  ],
  selfAwareness: ['得意領域: 課題深掘り', '成長領域: 柔軟な対応'],
};

describe('PersonalInfoSection', () => {
  it('renders the type label', () => {
    render(<PersonalInfoSection info={info} />);
    expect(screen.getByText('資質タイプ')).toBeInTheDocument();
  });

  it('renders the type name as a card-title heading', () => {
    render(<PersonalInfoSection info={info} />);
    expect(
      screen.getByRole('heading', { level: 3, name: '専門家 × エクスパンダー' })
    ).toBeInTheDocument();
  });

  it('renders the type description', () => {
    render(<PersonalInfoSection info={info} />);
    expect(screen.getByText('専門性を内省的に追求するタイプ')).toBeInTheDocument();
  });

  it('renders each top quality with title and description', () => {
    render(<PersonalInfoSection info={info} />);
    info.topQualities.forEach((q) => {
      expect(screen.getByRole('heading', { level: 5, name: q.title })).toBeInTheDocument();
      expect(screen.getByText(q.description)).toBeInTheDocument();
    });
  });

  it('renders the section heading for top qualities', () => {
    render(<PersonalInfoSection info={info} />);
    expect(screen.getByRole('heading', { level: 4, name: '上位 3 つの資質' })).toBeInTheDocument();
  });

  it('renders all self-awareness items', () => {
    render(<PersonalInfoSection info={info} />);
    info.selfAwareness.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('renders the self-awareness section heading', () => {
    render(<PersonalInfoSection info={info} />);
    expect(screen.getByRole('heading', { level: 4, name: '自己認識' })).toBeInTheDocument();
  });

  it('renders an empty list when selfAwareness has no items', () => {
    const emptyInfo = { ...info, selfAwareness: [] };
    render(<PersonalInfoSection info={emptyInfo} />);
    expect(screen.getByRole('heading', { level: 4, name: '自己認識' })).toBeInTheDocument();
  });

  it('renders a source attribution link when source is provided', () => {
    const withSource = {
      ...info,
      source: { name: 'アッテル', url: 'https://attelu.jp/' },
    };
    render(<PersonalInfoSection info={withSource} />);
    const link = screen.getByRole('link', { name: 'アッテル' });
    expect(link).toHaveAttribute('href', 'https://attelu.jp/');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not render the source attribution when source is omitted', () => {
    render(<PersonalInfoSection info={info} />);
    expect(screen.queryByText(/出典:/)).not.toBeInTheDocument();
  });
});
