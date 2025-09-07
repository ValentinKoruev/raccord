import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MessageDto } from '@shared/types/dto/Message';
import { MessageSocketResponse } from '@shared/types/api';

// TODO: refactor the types into chat.types.ts

type ChatType = 'text' | 'voice' | 'direct' | 'directGroup';

type ChatContext = {
  type: ChatType;
  title: string;
  icon?: {
    href: string;
    altColor: string;
  };
};

interface ChatState {
  context: ChatContext;
  messages: Array<MessageDto>;
}

const initialState: ChatState = {
  context: { type: 'text', title: '' },
  messages: [],
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChatChannel: (state, action: PayloadAction<{ channelContext: ChatContext; messages: MessageDto[] }>) => {
      const payload = action.payload;
      state.messages = [...payload.messages];
      state.context = payload.channelContext;
    },
    receiveMessage: (state, action) => {
      const msg = action.payload as MessageSocketResponse;
      state.messages.push(msg.message);
    },
    clearChat: (state) => {
      state.messages = [];
      state.context = { type: 'text', title: '' };
    },
  },
});

export const { setChatChannel, receiveMessage, clearChat } = chatSlice.actions;

export default chatSlice.reducer;
