import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { MessageSocketResponse } from '@shared/types/messageSocket';
import { receiveMessage } from 'src/redux/slices/chatSlice';
import { socket } from 'src/socket';

const useChat = () => {
  const dispatch = useAppDispatch();
  const title = useAppSelector((state) => state.chat.title);
  const activeChannelId = useAppSelector((state) => state.chat.activeChannelId);
  const messages = useAppSelector((state) => state.chat.messages);

  const onMessage = (messageResponse: MessageSocketResponse) => {
    dispatch(receiveMessage(messageResponse));
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
