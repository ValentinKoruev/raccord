import Hashtag from '@components/shared/svgs/Hashtag';
import styles from './Chat.module.scss';
import ChatBottomBar from '@components/ChatBottomBar';
import Message, { MessageProps } from '@components/Message';
import { addMinutes } from 'date-fns';
import pamela from '../../assets/whatsapp.jpg';
import nemanja from '../../assets/nemanja.png';
import bigu from '../../assets/bigu.jpg';

export type ChatProps = {
    title: string
}

const msgDate = new Date(2024, 7, 24, 2, 0, 0);

const messages : Array<MessageProps> = [
    { name: 'Whatsapp Malphite', image: pamela, content: "I'm moving as fast as I can", detailed: true, date: msgDate },
    { name: 'Whatsapp Malphite', image: pamela, content: "i hate oranges", detailed: false, date: msgDate },
    { name: 'Harmless Goblin', image: nemanja, content: "What is the meaning of the meaningless meaning", detailed: true, date: addMinutes(msgDate, 1) },
    { name: 'Big Guy', image: bigu, content: "tragedy", detailed: true, date: addMinutes(msgDate, 1) },
]

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
            <div className={styles.ChatContent}>
                <div className={styles.ChatMessages}>
                    { messages.map((message, index) => <Message key={`message-${index}`} {...message} />)}
                </div>
                <ChatBottomBar />
            </div>
        </div>
    );
}

export default Chat;