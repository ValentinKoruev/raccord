import { screen } from '@testing-library/react';
import Chat from './Chat';
import { renderWithProviders } from '@tests/renderWithProviders';
import { RootState } from '@redux/store';

import styles from './Chat.module.scss';

const makePreloadedState = (): Partial<RootState> => {
  return {
    session: {
      activeChannelId: 'D_Raccoon1',
      activeTabId: 'direct',
      activeDirectChannelId: 'D_Raccoon1',
      unreadChannelFlags: {},
    },
    chat: {
      title: 'General',
      messages: [],
    },
  };
};

let preloadedState: Partial<RootState>;

describe('Chat', () => {
  beforeEach(() => {
    preloadedState = makePreloadedState();
  });

  it('renders header with title from useChat', () => {
    renderWithProviders(<Chat />, { preloadedState });

    expect(screen.getByText(/general/i)).toBeInTheDocument();

    expect(screen.getByTestId('chat-header-icon')).toHaveClass(styles.HeaderIcon);
  });

  it('renders messages with detailed prop true for first message', () => {
    const now = new Date();

    preloadedState.chat?.messages.push({
      senderId: 'u1',
      senderName: 'raccoon1',
      content: 'Test start',
      date: now,
    });

    renderWithProviders(<Chat />, { preloadedState });

    expect(screen.getByText(/Test/i)).toBeInTheDocument();
    expect(screen.getByText(/raccoon1/i)).toBeInTheDocument();
  });

  it('marks consecutive messages from same sender within 30min as not detailed', () => {
    const now = new Date();
    const tenMinsLater = new Date(now.getTime() + 10 * 60 * 1000);

    preloadedState.chat?.messages.push({
      senderId: 'u1',
      senderName: 'raccoon1',
      content: 'Test start',
      date: now,
    });

    preloadedState.chat?.messages.push({
      senderId: 'u1',
      senderName: 'raccoon1',
      content: '10 mins later',
      date: tenMinsLater,
    });

    renderWithProviders(<Chat />, { preloadedState });

    // first is detailed
    expect(screen.getByText(/start/i)).toBeInTheDocument();

    // second message should render without showing username and icon
    expect(screen.getByText(/later/i)).toBeInTheDocument();

    expect(screen.getAllByText(/raccoon1/i)).toHaveLength(1);
  });

  it('marks messages over 30min apart as detailed', () => {
    const now = new Date();
    const fortyMinsLater = new Date(now.getTime() + 40 * 60 * 1000);

    preloadedState.chat?.messages.push({
      senderId: 'u1',
      senderName: 'raccoon1',
      content: 'Test start',
      date: now,
    });

    preloadedState.chat?.messages.push({
      senderId: 'u1',
      senderName: 'raccoon1',
      content: '40 mins later',
      date: fortyMinsLater,
    });

    renderWithProviders(<Chat />, { preloadedState });

    expect(screen.getByText(/start/i)).toBeInTheDocument();
    expect(screen.getByText(/later/i)).toBeInTheDocument();

    // both messages should show the username since 40min gap resets detail
    expect(screen.getAllByText(/raccoon1/i)).toHaveLength(2);
  });
});
