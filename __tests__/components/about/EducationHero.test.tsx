import { render, screen } from '@testing-library/react';
import { EducationHero } from '@/components/about/EducationHero';
import type { EducationImage } from '@/types';

const fixture: EducationImage[] = [
  { src: '/images/test-1.png', alt: '画像 1', caption: 'キャプション 1' },
  { src: '/images/test-2.png', alt: '画像 2' },
];

describe('EducationHero', () => {
  it('renders one list item per image', () => {
    render(<EducationHero images={fixture} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(fixture.length);
  });

  it('renders an aria-labeled list region', () => {
    render(<EducationHero images={fixture} />);
    expect(screen.getByRole('list', { name: '学術研究の背景画像' })).toBeInTheDocument();
  });

  it('renders images using the alt text', () => {
    render(<EducationHero images={fixture} />);
    expect(screen.getByAltText('画像 1')).toBeInTheDocument();
    expect(screen.getByAltText('画像 2')).toBeInTheDocument();
  });

  it('renders captions only when provided', () => {
    render(<EducationHero images={fixture} />);
    expect(screen.getByText('キャプション 1')).toBeInTheDocument();
    expect(screen.queryByText('画像 2のキャプション')).not.toBeInTheDocument();
  });

  it('renders nothing when images array is empty', () => {
    const { container } = render(<EducationHero images={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
