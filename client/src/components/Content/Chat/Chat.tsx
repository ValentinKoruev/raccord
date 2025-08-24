import { FC } from 'react';
import { differenceInMinutes } from 'date-fns';
import useChat from './hooks/useChat';
import { MessageDto } from '@shared/types/dto/Message';
import Icon from '@shared/components/Icon';
import Message from './Message';
import ChatBottomBar from '@components/Content/Chat/ChatBottomBar';
import styles from './Chat.module.scss';

export type ChatProps = {};

const Chat: FC<ChatProps> = () => {
  const { activeChannelId, messages, title } = useChat();

  const isDetailed = (message: MessageDto, prevMessage: MessageDto) => {
    if (!prevMessage) return true;

    if (message.senderId != prevMessage.senderId) return true;

    const diffInMinutes = Math.abs(differenceInMinutes(message.date, prevMessage.date));

    return diffInMinutes > 30;
  };

  const renderMessages = () => {
    if (!activeChannelId) return;

    return messages.map((mes, index, array) => {
      return (
        <Message
          key={`message-${index}`}
          detailed={isDetailed(mes, array[index - 1])}
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
          <Icon data-testid="chat-header-icon" name="hashtag" className={styles.HeaderIcon} />
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
