import Hashtag from '@components/shared/svgs/Hashtag';
import styles from './Chat.module.scss';
import ChatBottomBar from '@components/ChatBottomBar';
import Message from '@components/Message';
import pamela from '../../assets/whatsapp.jpg'

export type ChatProps = {
    title: string
}

const Chat = ({title} : ChatProps) => {

    const msgDate = new Date(2024, 7, 22, 2, 0, 0);

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
            <div className={styles.ChatContent}>
                <div className={styles.ChatMessages}>
                    <Message name='Pamela' image={pamela} content='helloo >.<' detailed={true} date={msgDate}/>
                    <Message name='Pamela' image={pamela} content='im pamela' detailed={false} date={msgDate}/>
                    <Message nameColor='#f00' name='Dbeliq' image={pamela} content='erm' detailed={true} date={msgDate}/>
                    <Message name='Pamela' image={pamela} content='test test' detailed={true} date={msgDate}/>
                </div>
                <ChatBottomBar />
            </div>
        </div>
    );
}

export default Chat;