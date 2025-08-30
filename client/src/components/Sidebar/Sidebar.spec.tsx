import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Sidebar from '../Sidebar';
import { renderWithProviders } from '@tests/renderWithProviders';
import { GuildDto } from '@shared/types/dto/Guild';
import { Mock, vi } from 'vitest';
import apiQueries from '@queries/api';

const guilds: Array<GuildDto> = [
  {
    guildId: 'g1',
    guildName: 'Test Guild',
    channels: [{ type: 'text', id: 'c1', name: 'general' }],
  },
];

const DMs = [
  {
    publicId: 'u1',
    name: 'Raccoon1',
    icon: 'racc.png',
  },
  { publicId: 'u2', name: 'Beaver', icon: 'beaver.png' },
];

vi.mock('@queries/api', () => {
  return {
    default: {
      guildQueries: {
        getGuild: vi.fn(),
      },
      userQueries: {
        getUserDirect: vi.fn(),
      },
    },
  };
});

(apiQueries.userQueries.getUserDirect as any) = vi.fn().mockResolvedValue({
  data: DMs,
});

describe('Sidebar', () => {
  it('renders GuildList initially', () => {
    renderWithProviders(<Sidebar guilds={guilds} />);

    // This gets the first guild in the list, meaning guild list was rendered and rendered its children
    expect(screen.getByTestId('guild-list-element-g1')).toBeInTheDocument();
  });

  it('renders DirectSidebar when active tab id is null', async () => {
    renderWithProviders(<Sidebar guilds={guilds} />);

    await waitFor(() => {
      expect(screen.queryByTestId('direct-sidebar')).toBeInTheDocument();
    });
  });

  it('renders DirectSidebar when active tab id is direct', async () => {
    const user = userEvent.setup();

    renderWithProviders(<Sidebar guilds={guilds} />);

    await user.click(screen.getByTestId('guild-list-element-direct'));

    await waitFor(() => {
      expect(screen.queryByTestId('direct-sidebar')).toBeInTheDocument();
    });
  });

  it('renders GuildSidebar when sidebar.type = guild', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Sidebar guilds={guilds} />);

    (apiQueries.guildQueries.getGuild as Mock).mockResolvedValueOnce({
      data: {
        guildId: 'g1',
        guildName: 'Test Guild',
        channels: [
          {
            channelId: 'c1',
            name: 'general',
          },
        ],
      },
    });

    await user.click(screen.getByTestId('guild-list-element-g1'));

    // GuildSidebar should render the guild name + channel
    expect(screen.queryByTestId('guild-sidebar')).toBeInTheDocument();
    expect(await screen.findByText('general')).toBeInTheDocument();
  });
});
