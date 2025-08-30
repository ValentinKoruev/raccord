import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@tests/renderWithProviders';
import { GuildDto } from '@shared/types/dto/Guild';

import GuildList from './GuildList';

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
  const guilds: Array<GuildDto> = [
    { guildId: 'g1', guildName: 'Guild One', icon: 'icon1.png' },
    { guildId: 'g2', guildName: 'Guild Two', icon: 'icon2.png' },
  ];

  it('renders guilds and special items', () => {
    renderWithProviders(<GuildList guilds={guilds} />, { preloadedState });

    expect(screen.getByText(/Direct Messages/i)).toBeInTheDocument();
    expect(screen.getByText(/Guild One/i)).toBeInTheDocument();
    expect(screen.getByText(/Guild Two/i)).toBeInTheDocument();
    expect(screen.getByText(/Add server/i)).toBeInTheDocument();
  });

  it('activeTabId changes to direct when Direct Messages clicked', () => {
    const { store } = renderWithProviders(<GuildList guilds={guilds} />, { preloadedState });
    fireEvent.click(screen.getByText(/Direct Messages/i));

    const state = store.getState();

    expect(state.session.activeTabId).toBe('direct');
  });

  it('activeTabId changes to guildId when guild clicked', () => {
    const { store } = renderWithProviders(<GuildList guilds={guilds} />, { preloadedState });
    fireEvent.click(screen.getByText(/Guild Two/i));

    const state = store.getState();

    expect(state.session.activeTabId).toBe('g2');
  });

  it('dispatches openAddServerModal when Add server clicked', () => {
    const { store } = renderWithProviders(<GuildList guilds={[]} />, { preloadedState });

    fireEvent.click(screen.getByText(/Add server/i));

    const state = store.getState();

    expect(state.modal.type).toBe('addServer');
  });

  it('marks active and unread states correctly', () => {
    renderWithProviders(<GuildList guilds={guilds} />, { preloadedState });
    const guildActive = screen.getByTestId('guild-list-element-g1');
    const guildUnread = screen.getByTestId('guild-list-element-g2');

    // "Guild One" should be active (activeTabId == g1)
    expect(guildActive.className).toContain('Active');

    // "Guild Two" should be unread
    expect(guildUnread.className).toContain('Unread');
  });
});
