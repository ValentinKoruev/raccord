import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';

import GuildListElement from './GuildListElement';

describe('GuildListElement', () => {
  const baseProps = {
    guildId: 'g1',
    testId: 'g1',
    name: 'Test Guild',
    onClick: vi.fn(),
    image: 'icon.png',
    isActive: false,
    isUnread: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders image when provided', () => {
    render(<GuildListElement {...baseProps} />);
    const img = screen.getByRole('img', { name: /Test Guild/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'icon.png');
  });

  it('renders fallback letter if image fails to load', () => {
    render(<GuildListElement {...baseProps} />);
    const img = screen.getByRole('img', { name: /Test Guild/i });

    fireEvent.error(img);

    const fallback = screen.getByText('T');
    expect(fallback).toBeInTheDocument();
  });

  it('renders a ReactNode icon if image is a React element', () => {
    const customIcon = <span data-testid="custom-icon">🎉</span>;
    render(<GuildListElement {...baseProps} image={customIcon} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('applies Active and Unread classes correctly', () => {
    render(<GuildListElement {...baseProps} isActive={true} isUnread={true} />);
    const wrapper = screen.getByTestId('guild-list-element-g1');
    expect(wrapper.className).toContain('Active');
    expect(wrapper.className).toContain('Unread');
  });

  it('calls onClick with guildId when clicked', () => {
    render(<GuildListElement {...baseProps} />);
    const wrapper = screen.getByTestId('guild-list-element-g1');
    fireEvent.click(wrapper);
    expect(baseProps.onClick).toHaveBeenCalledWith('g1');
  });

  it('renders tooltip with the guild name', async () => {
    const user = userEvent.setup();

    render(<GuildListElement {...baseProps} />);

    const target = screen.getByTestId('guild-list-element-g1');

    await user.hover(target);

    expect(await screen.findByText('Test Guild')).toBeInTheDocument();

    await user.unhover(target);

    expect(screen.queryByText('Test Guild')).not.toBeInTheDocument();
  });
});
