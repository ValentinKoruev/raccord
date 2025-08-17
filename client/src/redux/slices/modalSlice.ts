import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
  type: 'addServer' | null;
  props: any;
}

const initialState: ModalState = {
  type: null,
  props: {},
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openAddServerModal: (state, action: PayloadAction<any>) => {
      state.type = 'addServer';
      state.props = action.payload;
    },
    closeModal: (state) => {
      state.type = null;
      state.props = {};
    },
  },
});

export const { openAddServerModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
