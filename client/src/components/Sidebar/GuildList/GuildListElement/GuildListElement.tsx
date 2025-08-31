import { FC, ReactNode, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './GuildListElement.module.scss';
import { createPortal } from 'react-dom';

export type GuildListElementProps = {
  name: string;
  onClick: Function;
  image?: string | ReactNode;

  testId?: string;
  guildId?: string;
  isActive?: boolean;
  isUnread?: boolean;
};

const GuildListElement: FC<GuildListElementProps> = ({ guildId, testId, name, onClick, image, isActive, isUnread }) => {
  const [error, setError] = useState<boolean>(false);

  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const elementRef = useRef<HTMLDivElement | null>(null);

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

  const handleMouseEnter = () => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();

    const top = rect.top + rect.height / 2;
    const left = rect.right + window.scrollX + 5;

    setCoords(() => ({ top, left }));

    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };
  const tooltipElement = tooltipVisible
    ? createPortal(
        <div
          style={{
            top: coords.top,
            left: coords.left,
          }}
          className={styles.TooltipContainer}
        >
          <div className={styles.Tooltip}>{name}</div>
        </div>,
        document.body,
      )
    : null;

  return (
    <div
      ref={elementRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={styles.ListElement}
    >
      <div
        onClick={() => onClick(guildId)}
        className={classNames(
          styles.IconWrapper,
          styles.Colored,
          isActive ? styles.Active : '',
          isUnread ? styles.Unread : '',
        )}
        data-testid={`guild-list-element-${testId}`}
      >
        {renderIcon({ image, error })}
      </div>
      {tooltipElement}
    </div>
  );
};

export default GuildListElement;
