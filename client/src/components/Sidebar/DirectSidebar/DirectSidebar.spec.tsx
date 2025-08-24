import { screen } from '@testing-library/react';
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

describe('DirectSidebar', () => {
  const friends = [
    { publicId: 'u1', name: 'Raccoon1', icon: 'raccoon1.png' },
    { publicId: 'u2', name: 'Beaver', icon: 'beaver.png' },
  ];

  const preloadedState = {
    session: {
      activeChannelId: 'D_u1',
      activeDirectChannelId: 'D_u1',
      activeTabId: 'direct',
      unreadChannelFlags: { D_u2: true },
    },
  };

  it('renders the Direct Messages header', () => {
    renderWithProviders(<DirectSidebar friends={friends} />, { preloadedState });
    expect(screen.getByText(/Direct Messages/i)).toBeInTheDocument();
  });

  it('renders all Friend components', () => {
    renderWithProviders(<DirectSidebar friends={friends} />, { preloadedState });
    friends.forEach((f) => {
      expect(screen.getByTestId(`friend-component-${f.publicId}`)).toBeInTheDocument();
      expect(screen.getByText(f.name)).toBeInTheDocument();
    });
  });

  it('marks the correct Friend as active', () => {
    renderWithProviders(<DirectSidebar friends={friends} />, { preloadedState });
    const activeFriend = screen.getByTestId('friend-component-u1');
    expect(activeFriend.className).toContain('Active');

    const inactiveFriend = screen.getByTestId('friend-component-u2');
    expect(inactiveFriend.className).not.toContain('Active');
  });

  it('marks the correct Friend as unread', () => {
    renderWithProviders(<DirectSidebar friends={friends} />, { preloadedState });
    const unreadFriend = screen.getByTestId('friend-component-u2');
    expect(unreadFriend.className).toContain('Unread');

    const readFriend = screen.getByTestId('friend-component-u1');
    expect(readFriend.className).not.toContain('Unread');
  });

  it('click triggers mutation, updates current active channel and current direct channel, removes unread status and sets chat values', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<DirectSidebar friends={friends} />, { preloadedState });

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
