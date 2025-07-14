import Hashtag from "@components/shared/svgs/Hashtag";
import ChatBottomBar from "@components/ChatBottomBar";
import Message from "@components/Message";
import useChat from "./hooks/useChat";
import styles from "./Chat.module.scss";

export type ChatProps = {
  title: string;
};

const Chat = ({ title }: ChatProps) => {
  const { messages } = useChat();

  return (
    <div className={styles.Chat}>
      <div className={styles.ChatHeader}>
        <div className={styles.ChatTitle}>
          <Hashtag className={styles.HeaderIcon} />
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
