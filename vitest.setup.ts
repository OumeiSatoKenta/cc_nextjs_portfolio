import '@testing-library/jest-dom/vitest';

// jsdom does not implement IntersectionObserver — provide a minimal no-op mock
// so that components using useInView can render in tests.
// Individual test files can override this with vi.stubGlobal() for finer control.
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
