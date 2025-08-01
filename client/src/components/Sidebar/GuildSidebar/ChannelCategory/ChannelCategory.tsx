import { MouseEventHandler, useState } from 'react';
import Channel, { ChannelProps } from '@components/Sidebar/GuildSidebar/Channel';
import Icon from '@shared/components/Icon';
import styles from './ChannelCategory.module.scss';

export type ChannelCategoryProps = {
  name: string;
  channels: Array<ChannelProps>;
};

const ChannelCategory = ({ name, channels = [] }: ChannelCategoryProps) => {
  const [channelsDropdown, useChannelsDropdown] = useState<Boolean>(true);

  const onHeaderClick: MouseEventHandler<HTMLElement> = () => {
    useChannelsDropdown((dropdown) => !dropdown);
  };

  const onCreateClick: MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation();
    console.log('Create click');
  };

  return (
    <div className={styles.ChannelCategory}>
      <div onClick={onHeaderClick} className={styles.CategoryHeader}>
        {channelsDropdown ? (
          <Icon name="arrow-down" className={styles.Dropdown} />
        ) : (
          <Icon name="arrow-right" className={styles.Dropdown} />
        )}
        <div className={styles.CategoryName}>{name}</div>
        <button onClick={onCreateClick} className={styles.CreateButton}>
          <Icon name="plus" className={styles.Plus} />
        </button>
      </div>
      {channelsDropdown && (
        <div className={styles.ChannelList}>
          {channels.map((channel, index) => (
            <Channel key={`channel-${index}`} type={channel.type} name={channel.name} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChannelCategory;
