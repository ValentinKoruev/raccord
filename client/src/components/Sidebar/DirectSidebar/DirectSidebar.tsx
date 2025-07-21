import Friend from '@components/Friend';
import bigu from '../../../assets/bigu.jpg';
import styles from './DirectSidebar.module.scss';

// may or may not rename this component later
const DirectSidebar = () => {
  return (
    <div className={styles.DirectSidebar}>
      <div className={styles.DirectMessagesContainer}>
        <div className={styles.DirectMessagesHeader}>Direct Messages</div>
        <div className={styles.DirectMessagesList}>
          <Friend name="Big Guy" image={bigu} />
          <Friend name="Big Guy" image={bigu} />
        </div>
      </div>
    </div>
  );
};

export default DirectSidebar;
