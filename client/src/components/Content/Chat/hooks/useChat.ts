import { MessageProps, MessageResponse } from '@components/Content/Chat/Message';
import { useEffect, useRef, useState } from 'react';
import { socket } from 'src/socket';

type UseChatType = {
  messages: Array<MessageProps>;
  setMessages: React.Dispatch<React.SetStateAction<MessageProps[]>>;
};

const useChat = (): UseChatType => {
  const [messages, setMessages] = useState<Array<MessageProps>>([]);
  const messagesRef = useRef<Array<MessageProps>>([]);

  const shouldMessageBeDetailed = (username: string): boolean => {
    const currentMessages = messagesRef.current;

    if (currentMessages.length <= 0) return true;

    return currentMessages[currentMessages.length - 1].username != username;
  };

  const onMessage = (messageResponse: MessageResponse) => {
    const message: MessageProps = {
      username: messageResponse.username,
      image: messageResponse.image,
      content: messageResponse.content,
      detailed: shouldMessageBeDetailed(messageResponse.username),
      date: messageResponse.date,
    };
    setMessages((state) => [...state, message]);
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

  return { messages, setMessages };
};

export default useChat;
