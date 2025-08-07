import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { MessageSocketResponse } from '@shared/types/messageSocket';
import { socket } from 'src/socket';
import { handleIncomingMessage } from 'src/redux/thunks/messageThunk';

const useChat = () => {
  const dispatch = useAppDispatch();
  const activeChannelId = useAppSelector((state) => state.session.activeChannelId);
  const title = useAppSelector((state) => state.chat.title);
  const messages = useAppSelector((state) => state.chat.messages);

  const onMessage = (messageResponse: MessageSocketResponse) => {
    dispatch(handleIncomingMessage(messageResponse));
  };

  useEffect(() => {
    socket.on('message', onMessage);

    return () => {
      socket.off('message', onMessage);
    };
  }, []);

  return { activeChannelId, messages, title };
};

export default useChat;
