import { screen, fireEvent } from '@testing-library/react';
import GuildSidebar from '../GuildSidebar';
import { formatGuildChannel } from '@shared/utils/channelFormatter';
import { renderWithProviders } from '@tests/renderWithProviders';
import { GuildDto } from '@shared/types/dto/Guild';

const preloadedSession = {
  activeChannelId: null,
  unreadChannelFlags: {},
  activeTabId: null,
  activeDirectChannelId: null,
};

describe('GuildSidebar', () => {
  const guild: GuildDto = {
    guildId: 'g1',
    guildName: 'Test Guild',
    banner: '/test-banner.png',
    channels: [
      { type: 'text', id: 'c1', name: 'general' },
      { type: 'voice', id: 'c2', name: 'voice 2' },
    ],
  };

  it('renders guild name and banner', () => {
    renderWithProviders(<GuildSidebar guild={guild} />);

    expect(screen.getByText('Test Guild')).toBeInTheDocument();
    expect(screen.getByAltText('Test Guild (banner)')).toBeInTheDocument();
  });

  it('renders channels with correct active/unread state', () => {
    const activeChannelId = formatGuildChannel('g1', 'c1');
    const unreadChannelId = formatGuildChannel('g1', 'c2');

    renderWithProviders(<GuildSidebar guild={guild} />, {
      preloadedState: {
        session: {
          ...preloadedSession,
          activeChannelId,
          unreadChannelFlags: { [unreadChannelId]: true },
        },
      },
    });

    // Active channel should have the "active" styling class (from channel styles)
    const activeChannel = screen.getByTestId('guild-channel-G_g1:c1');
    expect(activeChannel?.className).toMatch(/Active/);

    // Unread channel should have the "unread" styling class (from channel styles)
    const unreadChannel = screen.getByTestId('guild-channel-G_g1:c2');
    expect(unreadChannel?.className).toMatch(/Unread/);
  });

  it('toggles OptionsMenu on header click', () => {
    renderWithProviders(<GuildSidebar guild={guild} />);

    const header = screen.getByTestId('guild-sidebar-header');
    expect(screen.queryByTestId('guild-sidebar-options')).not.toBeInTheDocument();

    fireEvent.click(header);

    expect(screen.queryByTestId('guild-sidebar-options')).toBeInTheDocument();
  });

  it('renders whitespace for banner', () => {
    renderWithProviders(<GuildSidebar guild={guild} />);

    expect(screen.getByLabelText('hidden')).toBeInTheDocument();
  });
});
