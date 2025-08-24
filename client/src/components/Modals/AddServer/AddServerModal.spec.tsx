import { screen, fireEvent } from '@testing-library/react';
import AddServerModal from './AddServerModal';
import { renderWithProviders } from '@tests/renderWithProviders';

describe('AddServerModal', () => {
  it('renders base state by default', () => {
    renderWithProviders(<AddServerModal />);
    expect(screen.getByText('Add a server')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create server/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /join server/i })).toBeInTheDocument();
  });

  it('switches to create server form when "Create server" is clicked', () => {
    renderWithProviders(<AddServerModal />);
    fireEvent.click(screen.getByRole('button', { name: /create server/i }));
    expect(screen.getByText('Create a server')).toBeInTheDocument();
    expect(screen.getByTestId('create-server-form')).toBeInTheDocument();
  });

  it('switches to join server form when "Join server" is clicked', () => {
    renderWithProviders(<AddServerModal />);
    fireEvent.click(screen.getByRole('button', { name: /join server/i }));
    expect(screen.getByText('Join a server')).toBeInTheDocument();
    expect(screen.getByTestId('join-server-form')).toBeInTheDocument();
  });

  it('returns to base state when "Back" is clicked in create form', () => {
    renderWithProviders(<AddServerModal />);
    fireEvent.click(screen.getByRole('button', { name: /create server/i }));
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(screen.getByText('Add a server')).toBeInTheDocument();
  });

  it('returns to base state when "Back" is clicked in join form', () => {
    renderWithProviders(<AddServerModal />);
    fireEvent.click(screen.getByRole('button', { name: /join server/i }));
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(screen.getByText('Add a server')).toBeInTheDocument();
  });
});
