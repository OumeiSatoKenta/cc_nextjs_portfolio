import { render, screen, fireEvent } from '@testing-library/react';
import { vi, type MockedFunction } from 'vitest';
import { Navigation } from '@/components/layout/Navigation';
import { NAV_LINKS } from '@/data/navigation';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));

import { usePathname } from 'next/navigation';

const mockedUsePathname = usePathname as MockedFunction<typeof usePathname>;

const renderNav = (props: { isOpen: boolean; onClose: () => void }) =>
  render(<Navigation {...props} navLinks={NAV_LINKS} />);

describe('Navigation', () => {
  beforeEach(() => {
    mockedUsePathname.mockReturnValue('/');
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('renders all navigation links when open', () => {
    renderNav({ isOpen: true, onClose: vi.fn() });
    NAV_LINKS.forEach((link) => {
      expect(screen.getByRole('link', { name: link.label })).toBeInTheDocument();
    });
  });

  it('is hidden (pointer-events-none, opacity-0) when isOpen is false', () => {
    const { container } = renderNav({ isOpen: false, onClose: vi.fn() });
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain('pointer-events-none');
    expect(root.className).toContain('opacity-0');
    expect(root).toHaveAttribute('aria-hidden', 'true');
  });

  it('is visible (pointer-events-auto, opacity-100) when isOpen is true', () => {
    const { container } = renderNav({ isOpen: true, onClose: vi.fn() });
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain('pointer-events-auto');
    expect(root.className).toContain('opacity-100');
    expect(root).toHaveAttribute('aria-hidden', 'false');
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    renderNav({ isOpen: true, onClose });
    fireEvent.click(screen.getByRole('button', { name: 'メニューを閉じる' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the overlay is clicked', () => {
    const onClose = vi.fn();
    const { container } = renderNav({ isOpen: true, onClose });
    const overlay = container.querySelector('.bg-\\[rgba\\(0\\,0\\,0\\,0\\.4\\)\\]');
    expect(overlay).not.toBeNull();
    fireEvent.click(overlay!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when a navigation link is clicked', () => {
    const onClose = vi.fn();
    renderNav({ isOpen: true, onClose });
    fireEvent.click(screen.getByRole('link', { name: 'About' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the Escape key is pressed while open', () => {
    const onClose = vi.fn();
    renderNav({ isOpen: true, onClose });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on Escape when closed', () => {
    const onClose = vi.fn();
    renderNav({ isOpen: false, onClose });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('locks body scroll when open and restores the previous value on unmount', () => {
    document.body.style.overflow = 'scroll';
    const { unmount } = renderNav({ isOpen: true, onClose: vi.fn() });
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('scroll');
  });

  it('has dialog role with aria-modal when rendered', () => {
    renderNav({ isOpen: true, onClose: vi.fn() });
    const dialog = screen.getByRole('dialog', { name: 'ナビゲーションメニュー' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('closes the menu when the pathname changes while open', () => {
    const onClose = vi.fn();
    mockedUsePathname.mockReturnValue('/');
    const { rerender } = renderNav({ isOpen: true, onClose });
    expect(onClose).not.toHaveBeenCalled();

    mockedUsePathname.mockReturnValue('/about');
    rerender(<Navigation isOpen={true} onClose={onClose} navLinks={NAV_LINKS} />);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
