import { FC, useRef } from 'react';
import styles from './InviteToServerModal.module.scss';

type InviteToServerModalProps = {
  guildId: string;
};

const InviteToServerModal: FC<InviteToServerModalProps> = ({ guildId }) => {
  const textRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (!textRef.current) return;

    const range = document.createRange();
    range.selectNodeContents(textRef.current);

    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };
  return (
    <div className={styles.InviteToServerContainer}>
      <div className={styles.Header}>Invite users to the server</div>
      <div ref={textRef} onClick={handleClick} className={styles.GuildId}>
        {guildId}
      </div>
    </div>
  );
};

export default InviteToServerModal;
