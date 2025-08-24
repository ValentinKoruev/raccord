import { screen, fireEvent, waitFor } from '@testing-library/react';
import Channel from './Channel';
import apiQueries from '@queries/api';
import { vi } from 'vitest';
import { renderWithProviders } from '@tests/renderWithProviders';

import styles from './Channel.module.scss';

vi.mock('@queries/api', () => {
  return {
    default: {
      channelQueries: {
        getChannel: vi.fn(),
      },
    },
  };
});

describe('Channel', () => {
  const fakeChannelResponse = {
    data: {
      name: 'general',
      messages: [{ content: 'hello', senderId: 'u1', senderName: 'user1', date: new Date() }],
    },
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders text channel', () => {
    renderWithProviders(<Channel type="text" name="general" isActive={false} isUnread={false} channelId="c1" />);

    expect(screen.getByText('general')).toBeInTheDocument();
    expect(screen.getByTestId('text-icon')).toBeInTheDocument(); // assuming Icon uses `data-testid`
  });

  it('renders voice channel', () => {
    renderWithProviders(<Channel type="voice" name="Voice Chat" isActive={false} isUnread={false} channelId="v1" />);

    expect(screen.getByText('Voice Chat')).toBeInTheDocument();
    expect(screen.getByTestId('voice-icon')).toBeInTheDocument();
  });

  it('applies active and unread classes', () => {
    renderWithProviders(<Channel type="text" name="general" isActive={true} isUnread={true} channelId="c1" />);

    const channelDiv = screen.getByTestId('guild-channel-c1');
    expect(channelDiv).toHaveClass(styles.Active);
    expect(channelDiv).toHaveClass(styles.Unread);
  });

  it('clicking channel triggers mutation and updates redux', async () => {
    (apiQueries.channelQueries.getChannel as any).mockResolvedValueOnce(fakeChannelResponse);

    const { store } = renderWithProviders(
      <Channel type="text" name="general" isActive={false} isUnread={false} channelId="G_g1:c1" />,
    );

    fireEvent.click(screen.getByTestId('guild-channel-G_g1:c1'));

    await waitFor(() => {
      const state = store.getState();
      expect(state.session.activeChannelId).toBe('G_g1:c1');
      expect(state.chat.title).toBe('general');
      expect(state.chat.messages).toHaveLength(1);
    });
  });
});
