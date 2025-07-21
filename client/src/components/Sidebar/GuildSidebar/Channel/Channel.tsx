import { FC } from 'react';
import Icon from '@shared/components/Icon';
import styles from './Channel.module.scss';

export type ChannelType = 'text' | 'voice';

export type ChannelProps = {
  type: ChannelType;
  name: string;
};

const Channel: FC<ChannelProps> = ({ type, name }) => {
  const iconSize = '1.4em';

  const renderIcon = (type: ChannelType) => {
    switch (type) {
      case 'text':
        return <Icon name="hashtag" width={iconSize} height={iconSize} />;
      case 'voice':
        return <Icon name="volume-high" width={iconSize} height={iconSize} />;
    }
  };

  return (
    <div className={styles.Channel}>
      {renderIcon(type)}
      <div className={styles.ChannelName}>{name}</div>
      <div className={styles.OptionsMenu}>{/* options, create invites, chat for voice channels, etc.. */}</div>
    </div>
  );
};

export default Channel;
