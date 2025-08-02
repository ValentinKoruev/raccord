import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { MessageDto } from '@shared/types/dto/Message';

interface ChatData {
  variant: 'chat';
  content: {
    title: string;
    messages: Array<MessageDto>;
  };
}

interface LoadingData {
  variant: 'loading';
}

// further variants can be added here
type ContentVariant = ChatData | LoadingData;

export type ContentState = {
  data: ContentVariant;
};

const initialState: ContentState = {
  data: {
    variant: 'loading',
  },
};

export const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setContentToChat: (state, action: PayloadAction<ChatData>) => {
      state.data = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setContentToChat } = contentSlice.actions;

export default contentSlice.reducer;
