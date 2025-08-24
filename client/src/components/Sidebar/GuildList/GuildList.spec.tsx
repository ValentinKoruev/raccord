import { screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { renderWithProviders } from '@tests/renderWithProviders';

import type { UseMutationResult } from '@tanstack/react-query';
import useGuildMutate from './hooks/useGuildMutate';
import useDirectMutate from './hooks/useDirectMutate';
import { GuildDto } from '@shared/types/dto/Guild';

import GuildList from './GuildList';

vi.mock('./hooks/useGuildMutate', () => ({
  default: vi.fn(),
}));
vi.mock('./hooks/useDirectMutate', () => ({
  default: vi.fn(),
}));

const preloadedState = {
  session: {
    activeTabId: 'g1',
    activeDirectChannelId: null,
    activeChannelId: null,
    unreadChannelFlags: {
      G_g2: true,
    },
  },
  modal: { type: null, props: {} },
};

describe('GuildList', () => {
  const mockGuildMutate: Partial<UseMutationResult<any, any, any, any>> = { mutate: vi.fn() };
  const mockDirectMutate: Partial<UseMutationResult<any, any, any, any>> = { mutate: vi.fn() };

  const guilds: Array<GuildDto> = [
    { guildId: 'g1', guildName: 'Guild One', icon: 'icon1.png' },
    { guildId: 'g2', guildName: 'Guild Two', icon: 'icon2.png' },
  ];

  beforeEach(() => {
    vi.mocked(useGuildMutate).mockReturnValue(mockGuildMutate as UseMutationResult<any, any, any, any>);
    vi.mocked(useDirectMutate).mockReturnValue(mockDirectMutate as UseMutationResult<any, any, any, any>);
  });

  it('renders guilds and special items', () => {
    renderWithProviders(<GuildList guilds={guilds} setSidebar={vi.fn()} />, { preloadedState });

    expect(screen.getByText(/Direct Messages/i)).toBeInTheDocument();
    expect(screen.getByText(/Guild One/i)).toBeInTheDocument();
    expect(screen.getByText(/Guild Two/i)).toBeInTheDocument();
    expect(screen.getByText(/Add server/i)).toBeInTheDocument();
  });

  it('calls directMutate when Direct Messages clicked', () => {
    renderWithProviders(<GuildList guilds={guilds} setSidebar={vi.fn()} />, { preloadedState });
    fireEvent.click(screen.getByText(/Direct Messages/i));
    expect(mockDirectMutate.mutate).toHaveBeenCalled();
  });

  it('calls guildMutate with guildId when guild clicked', () => {
    renderWithProviders(<GuildList guilds={guilds} setSidebar={vi.fn()} />, { preloadedState });
    fireEvent.click(screen.getByText(/Guild Two/i));
    expect(mockGuildMutate.mutate).toHaveBeenCalledWith('g2');
  });

  it('dispatches openAddServerModal when Add server clicked', () => {
    const { store } = renderWithProviders(<GuildList guilds={[]} setSidebar={vi.fn()} />, { preloadedState });

    fireEvent.click(screen.getByText(/Add server/i));

    const state = store.getState();

    expect(state.modal.type).toBe('addServer');
  });

  it('marks active and unread states correctly', () => {
    renderWithProviders(<GuildList guilds={guilds} setSidebar={vi.fn()} />, { preloadedState });
    const guildActive = screen.getByTestId('guild-list-element-g1');
    const guildUnread = screen.getByTestId('guild-list-element-g2');

    // "Guild One" should be active (activeTabId == g1)
    expect(guildActive.className).toContain('Active');

    // "Guild Two" should be unread
    expect(guildUnread.className).toContain('Unread');
  });
});
