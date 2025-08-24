import { FC, useState, useRef } from 'react';
import { useAppSelector } from '@redux/store';
import { GuildDto } from '@shared/types/dto/Guild';
import { formatGuildChannel } from '@shared/utils/channelFormatter';
import Channel from '@components/Sidebar/GuildSidebar/Channel';
import ChannelCategory from '@components/Sidebar/GuildSidebar/ChannelCategory';
import OptionsMenu from './OptionsMenu';
import Icon from '@shared/components/Icon';
import styles from './GuildSidebar.module.scss';

export type GuildSidebarProps = {
  guild: GuildDto;
};

const GuildSidebar: FC<GuildSidebarProps> = ({ guild }) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const activeChannelId = useAppSelector((state) => state.session.activeChannelId);
  const unreadFlags = useAppSelector((state) => state.session.unreadChannelFlags);

  //? Can be memoised
  const channelList = (guild: GuildDto) => {
    return guild.channels?.map((c, index) => {
      const formattedGuildChannel = formatGuildChannel(guild.guildId, c.id);

      return (
        <Channel
          key={`channel-${index}`}
          type="text"
          name={c.name}
          isActive={formattedGuildChannel == activeChannelId}
          isUnread={unreadFlags[formattedGuildChannel]}
          channelId={formattedGuildChannel}
        />
      );
    });
  };

  const onHeaderClick = () => {
    setIsOptionsOpen((state) => !state);
  };

  return (
    <div data-testid="guild-sidebar" className={styles.GuildSidebar}>
      <div data-testid="guild-sidebar-header" ref={headerRef} onClick={onHeaderClick} className={styles.GuildHeader}>
        <div className={`${styles.GuildInfo} ${guild.banner ? '' : styles.Base}`}>
          <div className={styles.GuildName}>{guild.guildName}</div>
          <Icon name="arrow-down" fill="inherit" width="0.8em" height="0.8em" />
        </div>
        {guild.banner && (
          <div className={styles.GuildBannerWrapper}>
            <img className={styles.GuildBanner} src={guild.banner} alt={`${guild.guildName} (banner)`} />
          </div>
        )}
        <OptionsMenu isOpen={isOptionsOpen} setIsOpen={setIsOptionsOpen} headerRef={headerRef} />
      </div>
      {guild.banner && <div className={styles.BannerWhitespace} aria-label="hidden" /> /* whitespace for banner */}
      <div className={styles.ChannelsContainer}>{channelList(guild)}</div>
    </div>
  );
};

export default GuildSidebar;
