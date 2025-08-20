import { FC, ReactNode, useState } from 'react';
import classNames from 'classnames';
import styles from './GuildListElement.module.scss';

export type GuildListElementProps = {
  name: string;
  onClick: Function;
  image?: string | ReactNode;

  guildId?: string;
  isActive?: boolean;
  isUnread?: boolean;
};

const GuildListElement: FC<GuildListElementProps> = ({ guildId, name, onClick, image, isActive, isUnread }) => {
  const [error, setError] = useState<boolean>(false);
  const renderIcon = ({ image, error }: { image?: string | ReactNode; error: boolean }) => {
    if (!error) {
      if (typeof image === 'string')
        return <img className={styles.Icon} src={image} alt={name} onError={() => setError(true)} />;

      if (image) {
        return <>{image}</>;
      }
    }

    return (
      <div className={styles.NoIcon}>
        <div>{name[0]}</div>
      </div>
    );
  };

  return (
    <div className={styles.ListElement}>
      <div
        onClick={() => onClick(guildId)}
        className={classNames(
          styles.IconWrapper,
          styles.Colored,
          isActive ? styles.Active : '',
          isUnread ? styles.Unread : '',
        )}
      >
        {renderIcon({ image, error })}
        <div className={styles.TooltipContainer}>
          <div className={styles.Tooltip}>{name}</div>
        </div>
      </div>
    </div>
  );
};

export default GuildListElement;
