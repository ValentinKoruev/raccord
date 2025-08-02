import { FC } from 'react';
import useChat from './hooks/useChat';
import ChatBottomBar from '@components/Content/Chat/ChatBottomBar';
import Message from '@components/Content/Chat/Message';
import Icon from '@shared/components/Icon';
import styles from './Chat.module.scss';
import { MessageDto } from '@shared/types/dto/Message';

export type ChatProps = {
  title: string;
  initialMessages: Array<MessageDto>;
};

const Chat: FC<ChatProps> = ({ title, initialMessages }) => {
  const { messages, setMessages } = useChat({ initialMessages });

  const renderMessages = () => {
    return messages.map((mes, index, array) => {
      const isDetailed = array[index - 1]?.senderId !== mes.senderId;
      return (
        <Message
          key={`message-${index}`}
          detailed={isDetailed}
          username={mes.senderName}
          date={mes.date}
          content={mes.content}
          image={mes.icon}
        />
      );
    });
  };

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
        <div className={styles.ChatMessages}>{renderMessages()}</div>
        <ChatBottomBar />
      </div>
    </div>
  );
};

export default Chat;
