import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Variant = 'friends' | 'chat';

type ContentState = {
  variant: Variant;
};

const initialState: ContentState = {
  variant: 'friends',
};

export const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setContentVariant: (state, action: PayloadAction<Variant>) => {
      state.variant = action.payload;
    },
  },
});

export const { setContentVariant } = contentSlice.actions;

export default contentSlice.reducer;
