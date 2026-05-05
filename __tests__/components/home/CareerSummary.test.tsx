import { render, screen } from '@testing-library/react';
import { CareerSummary } from '@/components/home/CareerSummary';
import type { CareerOverview } from '@/types';

const careers: CareerOverview[] = [
  { company: 'Acme Corp', role: 'SRE', period: { start: '2024-01' } },
  { company: 'Beta Inc', role: 'DBRE', period: { start: '2022-04', end: '2023-12' } },
  { company: 'Gamma Co', role: 'Backend', period: { start: '2020-04', end: '2022-03' } },
  { company: 'Delta LLC', role: 'Intern', period: { start: '2019-07', end: '2019-09' } },
];

describe('CareerSummary', () => {
  it('renders the first 3 careers by default', () => {
    render(<CareerSummary careers={careers} />);
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings).toHaveLength(3);
    expect(headings[0]).toHaveTextContent('Acme Corp');
    expect(headings[1]).toHaveTextContent('Beta Inc');
    expect(headings[2]).toHaveTextContent('Gamma Co');
  });

  it('respects the limit prop', () => {
    render(<CareerSummary careers={careers} limit={2} />);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
  });

  it("renders '現在' for ongoing careers (no end date)", () => {
    render(<CareerSummary careers={careers} limit={1} />);
    expect(screen.getByText('2024-01 – 現在')).toBeInTheDocument();
  });

  it('renders the formatted period for completed careers', () => {
    render(<CareerSummary careers={careers} limit={2} />);
    expect(screen.getByText('2022-04 – 2023-12')).toBeInTheDocument();
  });

  it('renders the role text alongside the company', () => {
    render(<CareerSummary careers={careers} limit={1} />);
    expect(screen.getByText('SRE')).toBeInTheDocument();
  });

  it('renders nothing when careers is empty', () => {
    render(<CareerSummary careers={[]} />);
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('sets dateTime attribute with start value for ongoing careers', () => {
    render(<CareerSummary careers={careers} limit={1} />);
    const time = screen.getByText('2024-01 – 現在');
    expect(time.tagName).toBe('TIME');
    expect(time).toHaveAttribute('dateTime', '2024-01');
  });

  it('sets dateTime attribute with start/end interval for completed careers', () => {
    render(<CareerSummary careers={careers} limit={2} />);
    const time = screen.getByText('2022-04 – 2023-12');
    expect(time).toHaveAttribute('dateTime', '2022-04/2023-12');
  });
});
