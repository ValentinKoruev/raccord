import { screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import ChatBottomBar from './ChatBottomBar';
import { renderWithProviders } from '@tests/renderWithProviders';
import { setActiveChannel } from '@redux/slices/sessionSlice';

// 🔧 mock getSocket
const emitMock = vi.fn();
vi.mock('@socket', () => ({
  getSocket: vi.fn(() => ({ emit: emitMock })),
}));

const preloadedState = {
  session: { activeChannelId: 'D_channel-1', activeTabId: null, activeDirectChannelId: null, unreadChannelFlags: {} },
};

describe('ChatBottomBar', () => {
  it('renders input with placeholder', () => {
    renderWithProviders(<ChatBottomBar />, { preloadedState });
    expect(screen.getByPlaceholderText(/message/i)).toBeInTheDocument();
  });

  it('focuses input when container is clicked', () => {
    renderWithProviders(<ChatBottomBar />, { preloadedState });
    const input = screen.getByPlaceholderText(/message/i) as HTMLInputElement;
    fireEvent.click(input.parentElement!);
    expect(document.activeElement).toBe(input);
  });

  it('does not emit when Enter is pressed with empty input', () => {
    renderWithProviders(<ChatBottomBar />, { preloadedState });
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(emitMock).not.toHaveBeenCalled();
  });

  it('emits message and clears input on Enter', () => {
    renderWithProviders(<ChatBottomBar />, { preloadedState });
    const input = screen.getByPlaceholderText(/message/i) as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'Hello world' } });
    fireEvent.keyDown(document, { key: 'Enter' });

    expect(emitMock).toHaveBeenCalledWith('message', {
      content: 'Hello world',
      channelId: 'D_channel-1',
    });
    expect(input.value).toBe('');
  });

  it('uses updated channelId from store', async () => {
    const { store } = renderWithProviders(<ChatBottomBar />, { preloadedState });

    const input = screen.getByPlaceholderText(/message/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Test' } });

    // update redux
    act(() => {
      store.dispatch(setActiveChannel({ type: 'direct', channelId: 'channel-99' }));
    });

    await act(async () => {});

    fireEvent.keyDown(document, { key: 'Enter' });

    expect(store.getState().session.activeChannelId).toBe('D_channel-99');
    expect(emitMock).toHaveBeenCalledWith('message', {
      content: 'Test',
      channelId: 'D_channel-99',
    });
  });
});
