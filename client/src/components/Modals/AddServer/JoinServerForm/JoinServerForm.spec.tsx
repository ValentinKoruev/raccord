import { describe, it, expect, vi, Mock } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { useQueryClient } from '@tanstack/react-query';
import { renderWithProviders } from '@tests/renderWithProviders';
import apiQueries from '@queries/api';

import JoinServerForm from './JoinServerForm';

vi.mock('@queries/api', () => {
  return {
    default: {
      guildQueries: {
        join: vi.fn(),
      },
    },
  };
});

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQueryClient: vi.fn(),
  };
});

describe('JoinServerForm', () => {
  const onBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders input and buttons', () => {
    renderWithProviders(<JoinServerForm onBack={onBack} />);

    expect(screen.getByLabelText(/server id/i)).toBeInTheDocument();
    expect(screen.getByText(/back/i)).toBeInTheDocument();
    expect(screen.getByText(/join/i)).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', () => {
    renderWithProviders(<JoinServerForm onBack={onBack} />);
    fireEvent.click(screen.getByText(/back/i));
    expect(onBack).toHaveBeenCalled();
  });

  it('shows error if server id is empty', async () => {
    renderWithProviders(<JoinServerForm onBack={vi.fn()} />);
    fireEvent.click(screen.getByText(/join/i));

    expect(await screen.findByRole('alert')).toHaveTextContent('Guild id is empty');
  });

  it('calls API, invalidates user guild list query, and dispatches closeModal on successful join', async () => {
    const mockedUseQueryClient = useQueryClient as unknown as Mock;
    const mockQueryClient = { invalidateQueries: vi.fn() };
    mockedUseQueryClient.mockReturnValue(mockQueryClient);

    const { store } = renderWithProviders(<JoinServerForm onBack={onBack} />, {
      preloadedState: {
        modal: {
          type: 'addServer',
          props: {},
        },
      },
    });

    const input = screen.getByPlaceholderText(/server id/i);
    fireEvent.change(input, { target: { value: 'guild-123' } });

    const joinButton = screen.getByText(/join/i);
    fireEvent.click(joinButton);

    const joinMock = apiQueries.guildQueries.join as unknown as Mock;
    joinMock.mockResolvedValue({ success: true });

    await waitFor(() => {
      expect(apiQueries.guildQueries.join).toHaveBeenCalledWith({ guildId: 'guild-123' });

      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['userguilds'],
      });

      const state = store.getState();

      expect(state.modal.type).toBe(null);
    });
  });

  it('throws error if API rejects', async () => {
    const joinMock = apiQueries.guildQueries.join as unknown as Mock;
    joinMock.mockRejectedValue(new Error('API failed'));

    renderWithProviders(<JoinServerForm onBack={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/server id/i), { target: { value: 'guild-123' } });
    fireEvent.click(screen.getByText(/join/i));

    expect(await screen.findByRole('alert')).toHaveTextContent(/error/i);
  });
});
