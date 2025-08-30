import { screen, fireEvent, waitFor } from '@testing-library/react';
import { Mock, vi } from 'vitest';
import { renderWithProviders } from '@tests/renderWithProviders';
import apiQueries from '@queries/api';
import { formatGuildChannel } from '@shared/utils/channelFormatter';
import GuildSidebar from '../GuildSidebar';

const preloadedSession = {
  activeChannelId: null,
  unreadChannelFlags: {},
  activeTabId: null,
  activeDirectChannelId: null,
};

const guild = {
  guildId: 'g1',
  guildName: 'Test Guild',
  banner: '/test-banner.png',
  channels: [
    { type: 'text', id: 'c1', name: 'general' },
    { type: 'voice', id: 'c2', name: 'voice 2' },
  ],
};

(apiQueries.guildQueries.getGuild as Mock) = vi.fn().mockResolvedValue({
  data: guild,
});

describe('GuildSidebar', () => {
  it('renders guild name and banner', async () => {
    renderWithProviders(<GuildSidebar guildId={guild.guildId} />);

    await waitFor(() => {
      expect(screen.getByText('Test Guild')).toBeInTheDocument();
      expect(screen.getByAltText('Test Guild (banner)')).toBeInTheDocument();
    });
  });

  it('renders channels with correct active/unread state', () => {
    const activeChannelId = formatGuildChannel('g1', 'c1');
    const unreadChannelId = formatGuildChannel('g1', 'c2');

    renderWithProviders(<GuildSidebar guildId={guild.guildId} />, {
      preloadedState: {
        session: {
          ...preloadedSession,
          activeChannelId,
          unreadChannelFlags: { [unreadChannelId]: true },
        },
      },
    });

    waitFor(() => {
      // Active channel should have the "active" styling class (from channel styles)
      const activeChannel = screen.getByTestId('guild-channel-G_g1:c1');
      expect(activeChannel?.className).toMatch(/Active/);

      // Unread channel should have the "unread" styling class (from channel styles)
      const unreadChannel = screen.getByTestId('guild-channel-G_g1:c2');
      expect(unreadChannel?.className).toMatch(/Unread/);
    });
  });

  it('toggles OptionsMenu on header click', () => {
    renderWithProviders(<GuildSidebar guildId={guild.guildId} />);

    waitFor(() => {
      const header = screen.getByTestId('guild-sidebar-header');
      expect(screen.queryByTestId('guild-sidebar-options')).not.toBeInTheDocument();
      fireEvent.click(header);

      expect(screen.queryByTestId('guild-sidebar-options')).toBeInTheDocument();
    });
  });

  it('renders whitespace for banner', () => {
    renderWithProviders(<GuildSidebar guildId={guild.guildId} />);

    waitFor(() => {
      expect(screen.getByLabelText('hidden')).toBeInTheDocument();
    });
  });
});
