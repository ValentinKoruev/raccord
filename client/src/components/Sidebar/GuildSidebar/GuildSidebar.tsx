import { FC } from 'react';
import Channel, { ChannelProps } from '@components/Sidebar/GuildSidebar/Channel';
import ChannelCategory from '@components/Sidebar/GuildSidebar/ChannelCategory';
import Icon from '@shared/components/Icon';
import styles from './GuildSidebar.module.scss';

export type GuildSidebarProps = {
  name: string;
  banner?: string;
};

const testCategory1: Array<ChannelProps> = [
  { name: 'General', type: 'text' },
  { name: 'Memes', type: 'text' },
  { name: 'Pics', type: 'text' },
  { name: 'Too-long-to-read-awawawaw', type: 'text' },
];

const testCategory2: Array<ChannelProps> = [
  { name: 'Counting', type: 'text' },
  { name: 'Music', type: 'text' },
];

const testCategory3: Array<ChannelProps> = [
  { name: 'General', type: 'voice' },
  { name: 'Wow voice chat', type: 'voice' },
  { name: 'Gaming', type: 'voice' },
];

const GuildSidebar: FC<GuildSidebarProps> = ({ name, banner }) => {
  return (
    <div className={styles.GuildSidebar}>
      <div className={styles.GuildHeader}>
        <div className={`${styles.GuildInfo} ${banner ? '' : styles.Base}`}>
          <div className={styles.GuildName}>{name}</div>
          <Icon name="arrow-down" fill="inherit" width="0.8em" height="0.8em" />
        </div>
        {banner && (
          <div className={styles.GuildBannerWrapper}>
            <img className={styles.GuildBanner} src={banner} alt={`${name} (banner)`} />
          </div>
        )}
      </div>
      {banner && <div className={styles.BannerWhitespace} aria-label="hidden" /> /* whitespace for banner */}
      <div className={styles.ChannelsContainer}>
        <Channel type={'text'} name="Text Channel 1" />
        <Channel type={'voice'} name="Voice Channel 1" />
        <ChannelCategory name="Text Channels" channels={testCategory1} />
        <ChannelCategory name="Veryyyyy long tittle for testing" channels={testCategory2} />
        <ChannelCategory name="Voice Channels" channels={testCategory3} />
      </div>
    </div>
  );
};

export default GuildSidebar;
