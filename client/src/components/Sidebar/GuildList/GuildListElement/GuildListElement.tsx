import { FC } from 'react';
import styles from './GuildListElement.module.scss';

export type GuildListElementProps = {
  image: string;
  tooltip: string;
};

const GuildListElement: FC<GuildListElementProps> = ({ image, tooltip }) => {
  return (
    <div className={styles.ListElement}>
      <div className={styles.IconWrapper}>
        <img className={styles.Icon} src={image} alt={tooltip} />
        <div className={styles.TooltipContainer}>
          <div className={styles.Tooltip}>{tooltip}</div>
        </div>
      </div>
    </div>
  );
};

export default GuildListElement;
