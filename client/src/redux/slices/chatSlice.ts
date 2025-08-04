import { createSlice } from '@reduxjs/toolkit';
import { MessageDto } from '@shared/types/dto/Message';
import { MessageSocketResponse } from '@shared/types/messageSocket';

interface ChatState {
  title: string;
  messages: Array<MessageDto>;
  unreadFlags: {
    [channelId: string]: boolean;
  };
  activeChannelId: string | null;
}

const initialState: ChatState = {
  title: '',
  messages: [],
  unreadFlags: {},
  activeChannelId: null,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveChannel: (state, action) => {
      const channelId = action.payload;
      state.activeChannelId = channelId;
      state.unreadFlags[channelId] = false;
    },
    setChatChannel: (state, action) => {
      const payload = action.payload as { channelName: string; channelId: string; messages: MessageDto[] };
      state.messages = [...payload.messages];
      state.title = payload.channelName;
      state.activeChannelId = payload.channelId;
      state.unreadFlags[payload.channelId] = false;
    },
    receiveMessage: (state, action) => {
      const msg = action.payload as MessageSocketResponse;

      if (state.activeChannelId !== msg.channelId) {
        state.unreadFlags[msg.channelId] = true;
        return;
      }

      state.messages = [...state.messages, msg.message];
    },
  },
});

export const { setActiveChannel, setChatChannel, receiveMessage } = chatSlice.actions;

export default chatSlice.reducer;
