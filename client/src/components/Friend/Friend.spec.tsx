import { fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Friend from './Friend';
import { renderWithProviders } from '../../tests/renderWithProviders';
import { vi } from 'vitest';
import apiQueries from '@queries/api';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '@redux/store';

vi.mock('@queries/api', () => {
  return {
    default: {
      channelQueries: {
        getChannel: vi.fn(),
      },
    },
  };
});

describe('Friend component', () => {
  const baseProps = {
    image: '/fake.png',
    name: 'Raccoon1',
    userId: '123',
    isActive: false,
    isUnread: false,
  };

  it('renders friend name and image', () => {
    renderWithProviders(<Friend {...baseProps} />);

    expect(screen.getByText('Raccoon1')).toBeInTheDocument();
    expect(screen.getByAltText('Raccoon1 (pfp)')).toHaveAttribute('src', '/fake.png');
  });

  it('applies isActive and isUnread classes correctly', () => {
    const { rerender } = renderWithProviders(<Friend {...baseProps} isActive />);
    expect(screen.getByTestId('friend-component-123').className).toContain('isActive');

    rerender(<Friend {...baseProps} isUnread />);
    expect(screen.getByTestId('friend-component-123').className).toContain('isUnread');
  });

  it('calls mutation and dispatches Redux actions on click', async () => {
    const mockChannel = {
      id: '123',
      name: 'Raccoon1',
      messages: [{ id: '31412', content: 'Hi' }],
    };

    (apiQueries.channelQueries.getChannel as any).mockResolvedValue({ data: mockChannel });

    const store = configureStore({
      reducer: rootReducer,
    });

    const dispatchSpy = vi.spyOn(store, 'dispatch');

    renderWithProviders(<Friend {...baseProps} />, { store });

    fireEvent.click(screen.getByTestId('friend-component-123'));

    await waitFor(() => {
      expect(apiQueries.channelQueries.getChannel).toHaveBeenCalledWith('D_123');

      const actions = dispatchSpy.mock.calls.map((args) => args[0]);

      const sessionAction = actions.find((a) => a.type === 'session/setActiveChannel');
      expect(sessionAction).toBeDefined();
      expect(sessionAction!.payload).toEqual({ type: 'direct', channelId: '123' });

      const chatAction = actions.find((a) => a.type === 'chat/setChatChannel');
      expect(chatAction).toBeDefined();
      expect(chatAction!.payload).toEqual({
        channelName: 'Raccoon1',
        messages: [{ id: '31412', content: 'Hi' }],
      });
    });
  });

  it('does not dispatch if API returns no channel', async () => {
    (apiQueries.channelQueries.getChannel as any).mockResolvedValue({ data: null });

    const store = configureStore({
      reducer: rootReducer,
    });

    const dispatchSpy = vi.spyOn(store, 'dispatch');

    renderWithProviders(<Friend {...baseProps} />, { store });

    fireEvent.click(screen.getByTestId('friend-component-123'));

    await waitFor(() => {
      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });
});
