import Friend from '@components/Friend';
import styles from './DirectSidebar.module.scss';
import { FC } from 'react';

type DirectSidebarProps = {
  friends: {
    publicId: string;
    name: string;
    icon: string;
  }[];
};

// may or may not rename this component later
const DirectSidebar: FC<DirectSidebarProps> = ({ friends }) => {
  return (
    <div className={styles.DirectSidebar}>
      <div className={styles.DirectMessagesContainer}>
        <div className={styles.DirectMessagesHeader}>Direct Messages</div>
        <div className={styles.DirectMessagesList}>
          {friends.map((f) => (
            <Friend key={`${f.publicId}`} name={f.name} image={f.icon} userId={f.publicId} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DirectSidebar;
