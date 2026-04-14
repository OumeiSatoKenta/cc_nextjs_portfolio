import { act, render, renderHook } from '@testing-library/react';
import { useInView } from '@/hooks/useInView';

type IntersectionCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

function installMock() {
  let capturedCallback: IntersectionCallback | undefined;

  class MockObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = '';
    readonly thresholds: ReadonlyArray<number> = [];
    constructor(callback: IntersectionCallback) {
      capturedCallback = callback;
    }
    observe = mockObserve;
    unobserve = mockUnobserve;
    disconnect = mockDisconnect;
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }

  vi.stubGlobal('IntersectionObserver', MockObserver);

  return {
    fireEntry(isIntersecting: boolean) {
      if (!capturedCallback) throw new Error('Observer callback not captured');
      capturedCallback([{ isIntersecting } as Partial<IntersectionObserverEntry>]);
    },
  };
}

/** Helper component that renders a div with the hook's ref attached. */
function TestComponent({ onResult }: { onResult: (v: boolean) => void }) {
  const { ref, isInView } = useInView();
  onResult(isInView);
  return <div ref={ref} data-testid="observed" />;
}

describe('useInView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns isInView as false initially', () => {
    installMock();
    const { result } = renderHook(() => useInView());
    expect(result.current.isInView).toBe(false);
  });

  it('returns a ref object', () => {
    installMock();
    const { result } = renderHook(() => useInView());
    expect(result.current.ref).toHaveProperty('current');
  });

  it('observes the element when ref is attached', () => {
    installMock();
    render(<TestComponent onResult={() => {}} />);
    expect(mockObserve).toHaveBeenCalledTimes(1);
  });

  it('sets isInView to true when element is intersecting', () => {
    const mock = installMock();
    let latestValue = false;
    render(
      <TestComponent
        onResult={(v) => {
          latestValue = v;
        }}
      />
    );

    act(() => {
      mock.fireEntry(true);
    });

    expect(latestValue).toBe(true);
  });

  it('does not set isInView when element is not intersecting', () => {
    const mock = installMock();
    let latestValue = false;
    render(
      <TestComponent
        onResult={(v) => {
          latestValue = v;
        }}
      />
    );

    act(() => {
      mock.fireEntry(false);
    });

    expect(latestValue).toBe(false);
  });

  it('unobserves the element after intersection', () => {
    const mock = installMock();
    render(<TestComponent onResult={() => {}} />);

    act(() => {
      mock.fireEntry(true);
    });

    expect(mockUnobserve).toHaveBeenCalled();
  });

  it('disconnects observer on unmount', () => {
    installMock();
    const { unmount } = render(<TestComponent onResult={() => {}} />);
    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
