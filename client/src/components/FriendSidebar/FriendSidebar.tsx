import Friend from '@components/Friend/Friend';
import styles from './FriendSidebar.module.scss';
import bigu from '../../assets/bigu.jpg';

const FriendSidebar = () => {

    return (
        <div className={styles.FriendSidebar}>
            <div className={styles.DirectMessagesContainer}>
                <div className={styles.DirectMessagesHeader}>
                    Direct Messages
                </div>
                <div className={styles.DirectMessagesList}>
                    <Friend name='Big Guy' image={bigu}/>
                    <Friend name='Big Guy' image={bigu}/>
                </div>
            </div>
        </div>
    );  
}

export default FriendSidebar;