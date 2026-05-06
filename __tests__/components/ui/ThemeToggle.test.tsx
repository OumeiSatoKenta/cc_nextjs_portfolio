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

  it('renders a trigger button labeled with the current option', async () => {
    mockTheme = 'system';
    render(<ThemeToggle />);
    const trigger = await screen.findByRole('button', {
      name: 'ビジュアルモード: 現在ブラウザのデフォルト',
    });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows trigger label "ライト" when theme is light', async () => {
    mockTheme = 'light';
    render(<ThemeToggle />);
    expect(
      await screen.findByRole('button', { name: 'ビジュアルモード: 現在ライト' })
    ).toBeInTheDocument();
  });

  it('shows trigger label "ダーク" when theme is dark', async () => {
    mockTheme = 'dark';
    render(<ThemeToggle />);
    expect(
      await screen.findByRole('button', { name: 'ビジュアルモード: 現在ダーク' })
    ).toBeInTheDocument();
  });

  it('opens the menu when the trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const trigger = await screen.findByRole('button', { name: /ビジュアルモード/ });

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await user.click(trigger);

    const menu = await screen.findByRole('menu', { name: 'ビジュアルモードを選択' });
    expect(menu).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders the beta header and three menuitemradio options when open', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(await screen.findByRole('button', { name: /ビジュアルモード/ }));

    expect(screen.getByText('ビジュアルモード')).toBeInTheDocument();
    expect(screen.getByText('ベータ')).toBeInTheDocument();

    const items = screen.getAllByRole('menuitemradio');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('ブラウザのデフォルト');
    expect(items[1]).toHaveTextContent('ライト');
    expect(items[2]).toHaveTextContent('ダーク');
  });

  it('marks the active option with aria-checked=true', async () => {
    const user = userEvent.setup();
    mockTheme = 'light';
    render(<ThemeToggle />);
    await user.click(await screen.findByRole('button', { name: /ビジュアルモード/ }));

    const lightOption = screen.getByRole('menuitemradio', { name: /ライト/ });
    expect(lightOption).toHaveAttribute('aria-checked', 'true');

    const darkOption = screen.getByRole('menuitemradio', { name: /ダーク/ });
    expect(darkOption).toHaveAttribute('aria-checked', 'false');
  });

  it('selecting "ライト" calls setTheme with "light" and closes the menu', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(await screen.findByRole('button', { name: /ビジュアルモード/ }));

    await user.click(screen.getByRole('menuitemradio', { name: /ライト/ }));
    expect(mockSetTheme).toHaveBeenCalledWith('light');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('selecting "ダーク" calls setTheme with "dark"', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(await screen.findByRole('button', { name: /ビジュアルモード/ }));
    await user.click(screen.getByRole('menuitemradio', { name: /ダーク/ }));
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('selecting "ブラウザのデフォルト" calls setTheme with "system"', async () => {
    const user = userEvent.setup();
    mockTheme = 'light';
    render(<ThemeToggle />);
    await user.click(await screen.findByRole('button', { name: /ビジュアルモード/ }));
    await user.click(screen.getByRole('menuitemradio', { name: /ブラウザのデフォルト/ }));
    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });

  it('closes the menu when Escape is pressed', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(await screen.findByRole('button', { name: /ビジュアルモード/ }));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes the menu when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <button type="button">外側</button>
        <ThemeToggle />
      </div>
    );
    await user.click(await screen.findByRole('button', { name: /ビジュアルモード/ }));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '外側' }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
