import { FC } from 'react';
import Channel from '@components/Sidebar/GuildSidebar/Channel';
import ChannelCategory from '@components/Sidebar/GuildSidebar/ChannelCategory';
import Icon from '@shared/components/Icon';
import styles from './GuildSidebar.module.scss';
import { GuildDto } from '@shared/types/dto/Guild';

export type GuildSidebarProps = {
  guild: GuildDto;
};

const GuildSidebar: FC<GuildSidebarProps> = ({ guild }) => {
  return (
    <div className={styles.GuildSidebar}>
      <div className={styles.GuildHeader}>
        <div className={`${styles.GuildInfo} ${guild.banner ? '' : styles.Base}`}>
          <div className={styles.GuildName}>{guild.guildName}</div>
          <Icon name="arrow-down" fill="inherit" width="0.8em" height="0.8em" />
        </div>
        {guild.banner && (
          <div className={styles.GuildBannerWrapper}>
            <img className={styles.GuildBanner} src={guild.banner} alt={`${guild.guildName} (banner)`} />
          </div>
        )}
      </div>
      {guild.banner && <div className={styles.BannerWhitespace} aria-label="hidden" /> /* whitespace for banner */}
      <div className={styles.ChannelsContainer}>
        {guild.channels?.map((c, index) => (
          <Channel key={`channel-${index}`} type="text" name={c.name} />
        ))}
      </div>
    </div>
  );
};

export default GuildSidebar;
