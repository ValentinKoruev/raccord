// ChannelCategory.test.tsx
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@tests/renderWithProviders';

import ChannelCategory, { ChannelCategoryProps } from './ChannelCategory';

describe('ChannelCategory', () => {
  const baseProps: ChannelCategoryProps = {
    name: 'Test Category',
    channels: [
      { type: 'text', name: 'general', isActive: false, isUnread: false, channelId: '1' },
      { type: 'voice', name: 'chat', isActive: false, isUnread: true, channelId: '2' },
    ],
  };

  it('renders category name and channels by default', () => {
    renderWithProviders(<ChannelCategory {...baseProps} />);

    expect(screen.getByText('Test Category')).toBeInTheDocument();

    // Channels visible by default
    expect(screen.getAllByTestId(/guild-channel/)).toHaveLength(2);

    // Dropdown icon should be pointing down
    expect(screen.queryByTestId('category-dropdown-icon-open')).toBeInTheDocument();
    expect(screen.queryByTestId('category-dropdown-icon-closed')).not.toBeInTheDocument();
  });

  it('toggles dropdown on header click', () => {
    renderWithProviders(<ChannelCategory {...baseProps} />);

    const header = screen.getByTestId('category-header');

    // Collapse
    fireEvent.click(header);
    expect(screen.queryAllByTestId(/guild-channel/)).toHaveLength(0);
    expect(screen.queryByTestId('category-dropdown-icon-open')).not.toBeInTheDocument();
    expect(screen.queryByTestId('category-dropdown-icon-closed')).toBeInTheDocument();

    // Expand
    fireEvent.click(header);
    expect(screen.queryAllByTestId(/guild-channel/)).toHaveLength(2);
    expect(screen.queryByTestId('category-dropdown-icon-open')).toBeInTheDocument();
    expect(screen.queryByTestId('category-dropdown-icon-closed')).not.toBeInTheDocument();
  });

  it('stops propagation when clicking the create button', () => {
    renderWithProviders(<ChannelCategory {...baseProps} />);

    const header = screen.getByText('Test Category').closest('div')!;
    const createButton = screen.getByRole('button');

    // Collapse category
    fireEvent.click(header);
    expect(screen.queryByTestId(/guild-channel/)).not.toBeInTheDocument();

    // Expand again
    fireEvent.click(header);

    // Now click the create button - should not collapse
    fireEvent.click(createButton);
    expect(screen.getAllByTestId(/guild-channel/)).toHaveLength(2);
  });

  it('renders Channel with correct props', () => {
    renderWithProviders(<ChannelCategory {...baseProps} />);

    const channelEls = screen.getAllByText(/general|chat/);
    expect(channelEls).toHaveLength(2);
  });
});
