import { MessageDto } from '@shared/types/dto/Message';
import { MessageSocketResponse } from '@shared/types/messageSocket';
import { useEffect, useRef, useState } from 'react';
import { socket } from 'src/socket';

type UseChatProps = {
  initialMessages: Array<MessageDto>;
};

type UseChatType = {
  messages: Array<MessageDto>;
  setMessages: React.Dispatch<React.SetStateAction<MessageDto[]>>;
};

const useChat = ({ initialMessages }: UseChatProps): UseChatType => {
  const [messages, setMessages] = useState<Array<MessageDto>>(initialMessages);
  const messagesRef = useRef<Array<MessageDto>>([]);

  const onMessage = (messageResponse: MessageSocketResponse) => {
    setMessages((state) => [...state, messageResponse.message]);
  };

  useEffect(() => {
    socket.on('message', onMessage);

    return () => {
      socket.off('message', onMessage);
    };
  }, []);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  return { messages, setMessages };
};

export default useChat;
