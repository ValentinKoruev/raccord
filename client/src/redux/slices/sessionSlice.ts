import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { formatDirectChannel, formatGuildChannel, parseChannel } from '@shared/utils/channelFormatter';
import { RootState } from '../store';

interface SessionState {
  activeTabId: 'direct' | string | null;
  activeChannelId: string | null;
  unreadChannelFlags: Record<string, boolean>; //? change type to number if storing how much unreads is needed
}

const initialState: SessionState = {
  activeTabId: null,
  activeChannelId: null,
  unreadChannelFlags: {},
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setTabDirect(state) {
      state.activeTabId = 'direct';
    },
    setTabGuild(state, action: PayloadAction<string>) {
      state.activeTabId = action.payload;
    },
    setActiveChannel(state, action: PayloadAction<{ type: 'guild' | 'direct'; channelId: string; guildId?: string }>) {
      const type = action.payload.type;

      if (type === 'guild' && action.payload.guildId) {
        const formattedChannelId = formatGuildChannel(action.payload.guildId, action.payload.channelId);
        state.activeChannelId = formattedChannelId;
        delete state.unreadChannelFlags[formattedChannelId];
        return;
      }
      if (type === 'direct') {
        const formattedChannelId = formatDirectChannel(action.payload.channelId);
        state.activeChannelId = formattedChannelId;
        delete state.unreadChannelFlags[formattedChannelId];
        return;
      }

      state.activeChannelId = null;
    },
    setUnreadChannel(state, action: PayloadAction<string>) {
      state.unreadChannelFlags[action.payload] = true;
    },
  },
});

export const selectUnreadFlags = (state: RootState) => state.session.unreadChannelFlags;

export const selectUnreadByGuilds = createSelector([selectUnreadFlags], (unreadFlags) => {
  const result: Record<string, string[]> = {};
  Object.keys(unreadFlags).forEach((key) => {
    const parsed = parseChannel(key);
    if (parsed.type === 'guild') {
      const { guildId, channelId } = parsed;
      if (!result[guildId]) result[guildId] = [];
      result[guildId].push(channelId);
    } else if (parsed.type === 'direct') {
      if (!result[parsed.type]) result[parsed.type] = [];
      result[parsed.type].push(parsed.channelId);
    }
  });
  return result;
});

export const { setTabDirect, setTabGuild, setActiveChannel, setUnreadChannel } = sessionSlice.actions;

export default sessionSlice.reducer;
