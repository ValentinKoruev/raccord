import axios from 'axios';
import { FC, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import useChat from './hooks/useChat';
import ChatBottomBar from '@components/Content/Chat/ChatBottomBar';
import Message, { MessageProps } from '@components/Content/Chat/Message';
import Icon from '@shared/components/Icon';
import styles from './Chat.module.scss';

export type ChatProps = {
  title: string;
};

type Channel = {
  name: string;
  type: string;
  messages: Array<{
    content: string;
    createdAt: Date;
    sender: {
      name: string;
      icon: string;
    };
  }>;
};

const Chat: FC<ChatProps> = ({ title }) => {
  const { data, isSuccess, error } = useQuery<Channel[], Error>({
    queryKey: ['messages', '2'],
    queryFn: async () => {
      const response = await axios.get<Channel[]>(`http://localhost:4000/guild/channels`);
      return response.data;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const { messages, setMessages } = useChat();

  useEffect(() => {
    if (isSuccess && data) {
      const messages: MessageProps[] = data[0].messages.map((msg) => ({
        username: msg.sender.name,
        image: msg.sender.icon,
        content: msg.content,
        detailed: true,
        date: msg.createdAt,
      }));

      setMessages(messages);
    }
  }, [isSuccess, data]);

  if (error) return <p>Error loading messages: {error.message}</p>;

  return (
    <div className={styles.Chat}>
      <div className={styles.ChatHeader}>
        <div className={styles.ChatTitle}>
          <Icon name="hashtag" className={styles.HeaderIcon} />
          <span>{title}</span>
        </div>
        <div></div>
      </div>
      <div className={styles.ChatContent}>
        <div className={styles.ChatMessages}>
          {messages.map((message, index) => (
            <Message key={`message-${index}`} {...message} />
          ))}
        </div>
        <ChatBottomBar />
      </div>
    </div>
  );
};

export default Chat;
