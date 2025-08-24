import { screen } from '@testing-library/react';
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

vi.mock('@queries/api', () => {
  return {
    default: {
      guildQueries: {
        getGuild: vi.fn(),
      },
    },
  };
});

describe('Sidebar', () => {
  it('renders GuildList initially', () => {
    renderWithProviders(<Sidebar guilds={guilds} />);

    // This gets the guild elemnent, meaning guild list was rendered and rendered its children
    expect(screen.getByTestId('guild-list-element-g1')).toBeInTheDocument();
  });

  it('renders DirectSidebar when sidebar.type = direct', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Sidebar guilds={guilds} />);

    await user.click(screen.getByTestId('guild-list-element-direct'));

    // DirectSidebar should render the friend
    expect(await screen.queryByTestId('direct-sidebar')).toBeInTheDocument();
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
