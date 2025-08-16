import { createSlice } from '@reduxjs/toolkit';
import { MessageDto } from '@shared/types/dto/Message';
import { MessageSocketResponse } from '@shared/types/api';

interface ChatState {
  title: string;
  messages: Array<MessageDto>;
}

const initialState: ChatState = {
  title: '',
  messages: [],
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChatChannel: (state, action) => {
      const payload = action.payload as { channelName: string; messages: MessageDto[] };
      state.messages = [...payload.messages];
      state.title = payload.channelName;
    },
    receiveMessage: (state, action) => {
      const msg = action.payload as MessageSocketResponse;
      state.messages.push(msg.message);
    },
  },
});

export const { setChatChannel, receiveMessage } = chatSlice.actions;

export default chatSlice.reducer;
