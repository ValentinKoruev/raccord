import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
  type: 'addServer' | 'inviteToServer' | 'createChannel' | 'optionsMenu' | null;
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
    openInviteToServerModal: (state, action: PayloadAction<any>) => {
      state.type = 'inviteToServer';
      state.props = action.payload;
    },
    openCreateChannelModal: (state, action: PayloadAction<any>) => {
      state.type = 'createChannel';
      state.props = action.payload;
    },
    openOptionsMenuModal: (state, action: PayloadAction<any>) => {
      state.type = 'optionsMenu';
      console.log(action.payload);
      state.props = action.payload;
    },
    closeModal: (state) => {
      state.type = null;
      state.props = {};
    },
  },
});

export const { openAddServerModal, openInviteToServerModal, openCreateChannelModal, openOptionsMenuModal, closeModal } =
  modalSlice.actions;

export default modalSlice.reducer;
