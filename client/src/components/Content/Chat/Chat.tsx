import { FC } from 'react';
import useChat from './hooks/useChat';
import Icon from '@shared/components/Icon';
import Message from './Message';
import ChatBottomBar from '@components/Content/Chat/ChatBottomBar';
import styles from './Chat.module.scss';

export type ChatProps = {};

const Chat: FC<ChatProps> = () => {
  const { activeChannelId, messages, title } = useChat();

  const renderMessages = () => {
    if (!activeChannelId) return;

    return messages.map((mes, index, array) => {
      const isDetailed = array[index - 1]?.senderId !== mes.senderId;
      return (
        <Message
          key={`message-${index}`}
          detailed={isDetailed}
          username={mes.senderName}
          date={mes.date}
          content={mes.content}
          image={mes.icon!}
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
