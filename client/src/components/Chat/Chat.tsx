import Hashtag from '@components/shared/svgs/Hashtag';
import styles from './Chat.module.scss';

export type ChatProps = {
    title: string
}

const Chat = ({title} : ChatProps) => {
    return (
        <div className={styles.Chat}>
            <div className={styles.ChatHeader}>
                <div className={styles.ChatTitle}>
                    <Hashtag className={styles.HeaderIcon}/>
                    <span>{title}</span>
                </div>
                <div>
                    
                </div>
            </div>
        </div>
    );
}

export default Chat;