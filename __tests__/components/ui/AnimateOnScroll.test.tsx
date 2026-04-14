import { render, screen } from '@testing-library/react';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';

// Mock useInView hook
const mockUseInView = vi.fn();
vi.mock('@/hooks/useInView', () => ({
  useInView: () => mockUseInView(),
}));

describe('AnimateOnScroll', () => {
  const mockRef = { current: document.createElement('div') };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseInView.mockReturnValue({ ref: mockRef, isInView: false });
  });

  it('renders children', () => {
    render(
      <AnimateOnScroll>
        <p>Test content</p>
      </AnimateOnScroll>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies opacity-0 class when not in view', () => {
    mockUseInView.mockReturnValue({ ref: mockRef, isInView: false });
    const { container } = render(
      <AnimateOnScroll>
        <p>Hidden</p>
      </AnimateOnScroll>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveClass('opacity-0');
    expect(wrapper).not.toHaveClass('animate-fade-in-up');
  });

  it('applies animate-fade-in-up class when in view', () => {
    mockUseInView.mockReturnValue({ ref: mockRef, isInView: true });
    const { container } = render(
      <AnimateOnScroll>
        <p>Visible</p>
      </AnimateOnScroll>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveClass('animate-fade-in-up');
    expect(wrapper).not.toHaveClass('opacity-0');
  });

  it('sets animationDelay style when delay prop is provided', () => {
    mockUseInView.mockReturnValue({ ref: mockRef, isInView: true });
    const { container } = render(
      <AnimateOnScroll delay={200}>
        <p>Delayed</p>
      </AnimateOnScroll>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.animationDelay).toBe('200ms');
  });

  it('does not set animationDelay style when delay is 0', () => {
    mockUseInView.mockReturnValue({ ref: mockRef, isInView: true });
    const { container } = render(
      <AnimateOnScroll delay={0}>
        <p>No delay</p>
      </AnimateOnScroll>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.animationDelay).toBe('');
  });

  it('passes additional className to the wrapper', () => {
    mockUseInView.mockReturnValue({ ref: mockRef, isInView: false });
    const { container } = render(
      <AnimateOnScroll className="mt-32">
        <p>Styled</p>
      </AnimateOnScroll>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveClass('mt-32');
  });
});
