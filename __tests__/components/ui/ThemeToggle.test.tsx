import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

const mockSetTheme = vi.fn();
let mockTheme = 'system';

vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: mockTheme,
    setTheme: mockSetTheme,
  }),
}));

import { ThemeToggle } from '@/components/ui/ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTheme = 'system';
  });

  it('renders a placeholder before mount', () => {
    const { container } = render(<ThemeToggle />);
    const placeholder = container.querySelector('[aria-hidden="true"]');
    expect(placeholder).toBeInTheDocument();
  });

  it('renders a button after mount', async () => {
    render(<ThemeToggle />);
    const button = await screen.findByRole('button', { name: /テーマ切替/ });
    expect(button).toBeInTheDocument();
  });

  it('cycles from system to light on click', async () => {
    const user = userEvent.setup();
    mockTheme = 'system';
    render(<ThemeToggle />);
    const button = await screen.findByRole('button', { name: /テーマ切替/ });
    await user.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('cycles from light to dark on click', async () => {
    const user = userEvent.setup();
    mockTheme = 'light';
    render(<ThemeToggle />);
    const button = await screen.findByRole('button', { name: /テーマ切替/ });
    await user.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('cycles from dark to system on click', async () => {
    const user = userEvent.setup();
    mockTheme = 'dark';
    render(<ThemeToggle />);
    const button = await screen.findByRole('button', { name: /テーマ切替/ });
    await user.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });

  it('shows the correct aria-label for system mode', async () => {
    mockTheme = 'system';
    render(<ThemeToggle />);
    const button = await screen.findByRole('button', {
      name: 'テーマ切替: 現在システムモード',
    });
    expect(button).toBeInTheDocument();
  });

  it('shows the correct aria-label for light mode', async () => {
    mockTheme = 'light';
    render(<ThemeToggle />);
    const button = await screen.findByRole('button', {
      name: 'テーマ切替: 現在ライトモード',
    });
    expect(button).toBeInTheDocument();
  });

  it('shows the correct aria-label for dark mode', async () => {
    mockTheme = 'dark';
    render(<ThemeToggle />);
    const button = await screen.findByRole('button', {
      name: 'テーマ切替: 現在ダークモード',
    });
    expect(button).toBeInTheDocument();
  });
});
