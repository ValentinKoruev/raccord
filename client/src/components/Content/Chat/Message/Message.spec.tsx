import { render, screen } from '@testing-library/react';
import { format, formatRelative } from 'date-fns';
import Message from './Message';

describe('Message', () => {
  const baseProps = {
    username: 'Raccoon1',
    image: '/raccoon.png',
    content: 'Hey!',
    detailed: false,
    date: new Date(2024, 0, 1, 15, 30), // Jan 1, 2024 15:30
    nameColor: '#fff',
  };

  it('renders message content', () => {
    render(<Message {...baseProps} />);
    expect(screen.getByText('Hey!')).toBeInTheDocument();
  });

  it('renders with detailed view', () => {
    render(<Message {...baseProps} detailed />);

    expect(screen.getByText('Raccoon1')).toBeInTheDocument();

    const expectedDate = formatRelative(baseProps.date, new Date());
    expect(screen.getByText(expectedDate)).toBeInTheDocument();

    const img = screen.getByAltText(/Raccoon1 \(pfp\)/);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/raccoon.png');
  });

  it('renders with non-detailed view', () => {
    render(<Message {...baseProps} detailed={false} />);

    expect(screen.queryByText('Raccoon1')).not.toBeInTheDocument();

    expect(screen.queryByAltText(/Raccoon1 \(pfp\)/)).not.toBeInTheDocument();

    const expectedTime = format(baseProps.date, 'HH:mm');
    expect(screen.getByText(expectedTime)).toBeInTheDocument();
  });

  it('applies username color style', () => {
    render(<Message {...baseProps} detailed />);
    const usernameEl = screen.getByText('Raccoon1');
    expect(usernameEl).toHaveStyle({ color: '#fff' });
  });
});
