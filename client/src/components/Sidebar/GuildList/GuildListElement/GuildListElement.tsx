import { FC } from 'react';
import classNames from 'classnames';
import styles from './GuildListElement.module.scss';

export type GuildListElementProps = {
  name: string;
  onClick: Function;
  image?: string;
  guildId?: string;
  isActive?: boolean;
  isUnread?: boolean;
};

const GuildListElement: FC<GuildListElementProps> = ({ guildId, name, onClick, image, isActive, isUnread }) => {
  const renderIcon = (image?: string) => {
    if (image) return <img className={styles.Icon} src={image} alt={name} />;

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
        {renderIcon(image)}
        <div className={styles.TooltipContainer}>
          <div className={styles.Tooltip}>{name}</div>
        </div>
      </div>
    </div>
  );
};

export default GuildListElement;
