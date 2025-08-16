import { FC } from 'react';
import { useAppSelector } from '@redux/store';
import { formatDirectChannel } from '@shared/utils/channelFormatter';
import Friend from '@components/Friend';
import styles from './DirectSidebar.module.scss';

type DirectSidebarProps = {
  friends: {
    publicId: string;
    name: string;
    icon: string;
  }[];
};

// may or may not rename this component later
const DirectSidebar: FC<DirectSidebarProps> = ({ friends }) => {
  const activeChanneldId = useAppSelector((state) => state.session.activeChannelId);
  const unreadFlags = useAppSelector((state) => state.session.unreadChannelFlags);

  const directChannels = (directChannels: Array<any>) => {
    return directChannels.map((d) => {
      const formattedChannel = formatDirectChannel(d.publicId);

      return (
        <Friend
          key={d.publicId}
          name={d.name}
          image={d.icon}
          userId={d.publicId}
          isActive={activeChanneldId == formattedChannel}
          isUnread={unreadFlags[formattedChannel]}
        />
      );
    });
  };

  return (
    <div className={styles.DirectSidebar}>
      <div className={styles.DirectMessagesContainer}>
        <div className={styles.DirectMessagesHeader}>Direct Messages</div>
        <div className={styles.DirectMessagesList}>{directChannels(friends)}</div>
      </div>
    </div>
  );
};

export default DirectSidebar;
