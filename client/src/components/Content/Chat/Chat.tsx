import { FC } from 'react';
import { differenceInMinutes } from 'date-fns';
import { useAppSelector } from '@redux/store';
import { MessageDto } from '@shared/types/dto/Message';
import Icon from '@components/UI/Icon';
import Message from './Message';
import ChatBottomBar from '@components/Content/Chat/ChatBottomBar';
import styles from './Chat.module.scss';
import ExtraInfo from '../ExtraInfo';
import { getChatSymbol } from '@shared/utils/channelFormatter';

export type ChatProps = {};

const Chat: FC<ChatProps> = () => {
  const activeChannelId = useAppSelector((state) => state.session.activeChannelId);
  const chatContext = useAppSelector((state) => state.chat.context);
  const messages = useAppSelector((state) => state.chat.messages);

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

  const renderIcon = () => {
    switch (chatContext.type) {
      case 'text':
        return <Icon data-testid="chat-header-ico" name="hashtag" className={styles.HeaderIcon} />;
      case 'voice':
        return <Icon data-testid="chat-header-icon" name="volume-high" className={styles.HeaderIcon} />; // for support if we add voice channels text alts in the future
      case 'direct':
        return (
          <div className={styles.AvatarIcon}>
            <img src={chatContext.icon?.href} alt={`${chatContext.title} icon`} />
          </div>
        );
      case 'directGroup':
        return <Icon data-testid="chat-header-icon" name="hashtag" className={styles.HeaderIcon} />; // TODO: change this icon to a group icon
    }
  };

  return (
    <div className={styles.Chat}>
      <div className={styles.ChatHeader}>
        <div className={styles.ChatTitle}>
          {renderIcon()}
          <span>{chatContext.title}</span>
        </div>
        <div></div>
      </div>
      <div className={styles.ChatContentContainer}>
        <div className={styles.ChatContent}>
          <div className={styles.ChatMessages}>{renderMessages()}</div>
          <ChatBottomBar channelTitle={`${getChatSymbol(chatContext.type)}${chatContext.title}`} />
        </div>
        <ExtraInfo />
      </div>
    </div>
  );
};

export default Chat;
