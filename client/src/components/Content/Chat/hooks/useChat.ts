import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/store';
import { handleIncomingMessage } from '@redux/thunks/messageThunk';
import { MessageSocketResponse } from '@shared/types/api';
import { getSocket } from 'src/socket';

const useChat = () => {
  const dispatch = useAppDispatch();
  const activeChannelId = useAppSelector((state) => state.session.activeChannelId);
  const title = useAppSelector((state) => state.chat.title);
  const messages = useAppSelector((state) => state.chat.messages);

  const onMessage = (messageResponse: MessageSocketResponse) => {
    dispatch(handleIncomingMessage(messageResponse));
  };

  useEffect(() => {
    getSocket().on('message', onMessage);

    return () => {
      getSocket().off('message', onMessage);
    };
  }, []);

  return { activeChannelId, messages, title };
};

export default useChat;
