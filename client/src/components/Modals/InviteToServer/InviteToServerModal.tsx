import { FC } from 'react';
import styles from './InviteToServerModal.module.scss';

type InviteToServerModalProps = {
  guildId: string;
};

const InviteToServerModal: FC<InviteToServerModalProps> = ({ guildId }) => {
  return (
    <div className={styles.InviteToServerContainer}>
      <div className={styles.Header}>Invite users to the server</div>
      <div className={styles.GuildId}>{guildId}</div>
    </div>
  );
};

export default InviteToServerModal;
