import { render, screen } from '@testing-library/react';
import { SectionPreview } from '@/components/home/SectionPreview';

describe('SectionPreview', () => {
  const baseProps = {
    title: 'Career',
    ariaLabel: '経歴',
    href: '/about/',
    linkLabel: '経歴を詳しく見る',
  };

  it('renders the title as an h2 heading', () => {
    render(
      <SectionPreview {...baseProps}>
        <p>child</p>
      </SectionPreview>
    );
    expect(screen.getByRole('heading', { level: 2, name: baseProps.title })).toBeInTheDocument();
  });

  it('uses ariaLabel on the section landmark', () => {
    render(
      <SectionPreview {...baseProps}>
        <p>child</p>
      </SectionPreview>
    );
    expect(screen.getByRole('region', { name: baseProps.ariaLabel })).toBeInTheDocument();
  });

  it('renders a link to href with linkLabel including arrow suffix', () => {
    render(
      <SectionPreview {...baseProps}>
        <p>child</p>
      </SectionPreview>
    );
    const link = screen.getByRole('link', { name: `${baseProps.linkLabel} →` });
    expect(link.getAttribute('href')).toMatch(/^\/about\/?$/);
  });

  it('renders children inside the section', () => {
    render(
      <SectionPreview {...baseProps}>
        <p data-testid="child">hello</p>
      </SectionPreview>
    );
    expect(screen.getByTestId('child')).toHaveTextContent('hello');
  });
});
