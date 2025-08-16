import { MessageSocketResponse } from '@shared/types/api';
import { AppDispatch, RootState } from '../store';
import { receiveMessage } from '../slices/chatSlice';
import { setUnreadChannel } from '../slices/sessionSlice';

export const handleIncomingMessage =
  (message: MessageSocketResponse) => (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const activeChatId = state.session.activeChannelId;

    if (message.channelId !== activeChatId) dispatch(setUnreadChannel(message.channelId));
    else dispatch(receiveMessage(message));
  };
