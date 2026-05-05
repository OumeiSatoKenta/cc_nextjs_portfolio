import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EducationAccordion } from '@/components/about/EducationAccordion';
import type { Education } from '@/types';

const expandable: Education = {
  type: 'degree',
  title: '博士課程',
  institution: '名古屋大学',
  date: '2021-03',
  description: '研究内容の概要',
  details: 'より詳細な研究内容の記述',
  images: [
    { src: '/images/test-1.png', alt: '実験装置', caption: '装置のキャプション' },
    { src: '/images/test-2.png', alt: '空気シャワー' },
  ],
};

const nonExpandable: Education = {
  type: 'publication',
  title: 'Test Paper',
  institution: 'Test Conference',
  date: '2019',
  description: '簡単な要約',
};

describe('EducationAccordion', () => {
  it('renders all education entries with title and badge', () => {
    render(<EducationAccordion educations={[expandable, nonExpandable]} />);
    expect(screen.getByRole('heading', { level: 3, name: '博士課程' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Test Paper' })).toBeInTheDocument();
    expect(screen.getByText('学歴')).toBeInTheDocument();
    expect(screen.getByText('論文')).toBeInTheDocument();
  });

  it('renders an expandable card as a button with aria-expanded=false initially', () => {
    render(<EducationAccordion educations={[expandable]} />);
    const button = screen.getByRole('button', { name: /博士課程/ });
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders a non-expandable card without a button', () => {
    render(<EducationAccordion educations={[nonExpandable]} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('toggles aria-expanded and detail label when the button is clicked', async () => {
    const user = userEvent.setup();
    render(<EducationAccordion educations={[expandable]} />);
    const button = screen.getByRole('button');

    expect(screen.getByText('詳細を見る ▼')).toBeInTheDocument();
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('詳細を閉じる ▲')).toBeInTheDocument();

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders details text in expandable cards', () => {
    render(<EducationAccordion educations={[expandable]} />);
    expect(screen.getByText('より詳細な研究内容の記述')).toBeInTheDocument();
  });

  it('renders images with alt text from the data', () => {
    render(<EducationAccordion educations={[expandable]} />);
    expect(screen.getByAltText('実験装置')).toBeInTheDocument();
    expect(screen.getByAltText('空気シャワー')).toBeInTheDocument();
  });

  it('renders captions only when provided', () => {
    render(<EducationAccordion educations={[expandable]} />);
    expect(screen.getByText('装置のキャプション')).toBeInTheDocument();
  });

  it('renders dateTime attribute on the time element with the prefix label', () => {
    render(<EducationAccordion educations={[expandable]} />);
    const time = screen.getByText('修了: 2021-03');
    expect(time.tagName).toBe('TIME');
    expect(time).toHaveAttribute('dateTime', '2021-03');
  });

  it('uses publication date prefix for publication entries', () => {
    render(<EducationAccordion educations={[nonExpandable]} />);
    expect(screen.getByText('発表: 2019')).toBeInTheDocument();
  });

  it('renders an empty list when educations is empty', () => {
    render(<EducationAccordion educations={[]} />);
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('makes a card expandable when only details (no images) is provided', () => {
    const detailsOnly: Education = {
      type: 'certification',
      title: '資格',
      date: '2024',
      details: '詳細のみのカード',
    };
    render(<EducationAccordion educations={[detailsOnly]} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
