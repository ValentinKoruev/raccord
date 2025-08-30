import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@tests/renderWithProviders';

import DirectSidebar from './DirectSidebar';
import { vi } from 'vitest';

import apiQueries from '@queries/api';

(apiQueries.channelQueries.getChannel as any) = vi.fn().mockResolvedValue({
  data: {
    id: 'u2', //? this is direct message channel name, not user id
    name: 'Raccoon1',
    messages: [{ id: '1', content: 'Hi' }],
  },
});

const DMs = [
  {
    publicId: 'u1',
    name: 'Raccoon1',
    icon: 'racc.png',
  },
  { publicId: 'u2', name: 'Beaver', icon: 'beaver.png' },
];

(apiQueries.userQueries.getUserDirect as any) = vi.fn().mockResolvedValue({
  data: DMs,
});

describe('DirectSidebar', () => {
  const preloadedState = {
    session: {
      activeChannelId: 'D_u1',
      activeDirectChannelId: 'D_u1',
      activeTabId: 'direct',
      unreadChannelFlags: { D_u2: true },
    },
  };

  it('renders the DM header', async () => {
    renderWithProviders(<DirectSidebar />, { preloadedState });

    await waitFor(() => {
      expect(screen.getByText(/Direct Messages/i)).toBeInTheDocument();
    });
  });

  it('renders all DM components', async () => {
    renderWithProviders(<DirectSidebar />, { preloadedState });

    await waitFor(() => {
      DMs.forEach((f) => {
        expect(screen.getByTestId(`friend-component-${f.publicId}`)).toBeInTheDocument();
        expect(screen.getByText(f.name)).toBeInTheDocument();
      });
    });
  });

  it('marks the correct DM as active', async () => {
    renderWithProviders(<DirectSidebar />, { preloadedState });

    await waitFor(() => {
      const activeFriend = screen.getByTestId('friend-component-u1');
      expect(activeFriend.className).toContain('Active');

      const inactiveFriend = screen.getByTestId('friend-component-u2');
      expect(inactiveFriend.className).not.toContain('Active');
    });
  });

  it('marks the correct DM as unread', async () => {
    renderWithProviders(<DirectSidebar />, { preloadedState });

    await waitFor(() => {
      const unreadFriend = screen.getByTestId('friend-component-u2');
      expect(unreadFriend.className).toContain('Unread');

      const readFriend = screen.getByTestId('friend-component-u1');
      expect(readFriend.className).not.toContain('Unread');
    });
  });

  it('click updates current active channel and current direct channel, removes unread status and sets chat values', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<DirectSidebar />, { preloadedState });

    await waitFor(async () => {
      const friendDiv = screen.getByTestId('friend-component-u2');

      await user.click(friendDiv);

      const storeState = store.getState();
      expect(storeState.session.activeTabId).toBe('direct');
      expect(storeState.session.activeChannelId).toBe('D_u2');
      expect(storeState.session.activeDirectChannelId).toBe('D_u2');
      expect(storeState.session.unreadChannelFlags).toEqual({});

      expect(storeState.chat.title).toBe('Raccoon1');
      expect(storeState.chat.messages).toEqual([{ id: '1', content: 'Hi' }]);
    });
  });
});
