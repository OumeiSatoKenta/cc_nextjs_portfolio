import { renderHook } from '@testing-library/react';
import { useSectionObserver } from '@/hooks/useSectionObserver';

describe('useSectionObserver', () => {
  it('returns null initially when no sections are intersecting', () => {
    const { result } = renderHook(() => useSectionObserver({ sectionIds: ['intro', 'career'] }));
    expect(result.current).toBeNull();
  });

  it('returns null when sectionIds is empty', () => {
    const { result } = renderHook(() => useSectionObserver({ sectionIds: [] }));
    expect(result.current).toBeNull();
  });

  it('does not throw when section elements are missing from the DOM', () => {
    expect(() => {
      renderHook(() => useSectionObserver({ sectionIds: ['nonexistent-id'] }));
    }).not.toThrow();
  });

  it('accepts a custom rootMargin option without error', () => {
    const { result } = renderHook(() =>
      useSectionObserver({ sectionIds: ['intro'], rootMargin: '0px' })
    );
    expect(result.current).toBeNull();
  });
});
