import { describe, it, expect, vi, Mock } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/renderWithProviders';
import CreateServerForm from './CreateServerForm';
import { useQueryClient } from '@tanstack/react-query';
import apiQueries from '@queries/api';

vi.mock('@queries/api', () => {
  return {
    default: {
      guildQueries: {
        createGuild: vi.fn(),
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

describe('CreateServerForm', () => {
  const onBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders inputs and buttons', () => {
    renderWithProviders(<CreateServerForm onBack={onBack} />);

    expect(screen.getByLabelText(/server name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/server icon/i)).toBeInTheDocument();
    expect(screen.getByText(/back/i)).toBeInTheDocument();
    expect(screen.getByText(/create/i)).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', () => {
    renderWithProviders(<CreateServerForm onBack={onBack} />);
    fireEvent.click(screen.getByText(/back/i));
    expect(onBack).toHaveBeenCalled();
  });

  it('shows error if guild name is empty', async () => {
    renderWithProviders(<CreateServerForm onBack={vi.fn()} />);
    fireEvent.click(screen.getByText(/create/i));

    expect(await screen.findByRole('alert')).toHaveTextContent('Guild name is empty');
  });

  it('calls API, invalidates user guild list query, and dispatches closeModal on successful create', async () => {
    const mockedUseQueryClient = useQueryClient as unknown as Mock;
    const mockQueryClient = { invalidateQueries: vi.fn() };
    mockedUseQueryClient.mockReturnValue(mockQueryClient);

    const createMock = apiQueries.guildQueries.createGuild as Mock;
    createMock.mockResolvedValue({ success: true });

    const { store } = renderWithProviders(<CreateServerForm onBack={onBack} />, {
      preloadedState: {
        modal: {
          type: 'addServer',
          props: {},
        },
      },
    });

    const nameInput = screen.getByPlaceholderText(/server name/i);
    const iconInput = screen.getByPlaceholderText(/server icon/i);
    fireEvent.change(nameInput, { target: { value: 'raccoon-guild' } });
    // TODO: add image validation util and link validation
    fireEvent.change(iconInput, { target: { value: 'https://fake.com/raccoon_funny.png' } });

    const createButton = screen.getByText(/create/i);
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(apiQueries.guildQueries.createGuild).toHaveBeenCalledWith({
        guildName: 'raccoon-guild',
        guildIcon: 'https://fake.com/raccoon_funny.png',
      });

      // query invalidated
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['userguilds'],
      });

      const state = store.getState();

      expect(state.modal.type).toBe(null);
    });
  });

  it('throws error if API rejects', async () => {
    const createMock = apiQueries.guildQueries.createGuild as unknown as Mock;
    createMock.mockRejectedValue(new Error('API failed'));

    renderWithProviders(<CreateServerForm onBack={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/server name/i), { target: { value: 'raccoon-guild' } });
    fireEvent.click(screen.getByText(/create/i));

    expect(await screen.findByRole('alert')).toHaveTextContent(/error/i);
  });
});
