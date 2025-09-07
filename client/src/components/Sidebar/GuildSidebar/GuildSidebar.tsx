import { FC, useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@redux/store';
import { setChatChannel } from '@redux/slices/content/chatSlice';
import { setContentVariant } from '@redux/slices/content';
import { setActiveChannel } from '@redux/slices/sessionSlice';
import apiQueries from '@queries/api';
import { GuildDto } from '@shared/types/dto/Guild';
import { formatGuildChannel } from '@shared/utils/channelFormatter';
import Channel from '@components/Sidebar/GuildSidebar/Channel';
import ChannelCategory from '@components/Sidebar/GuildSidebar/ChannelCategory';
import OptionsMenu from './OptionsMenu';
import Icon from '@components/UI/Icon';
import styles from './GuildSidebar.module.scss';

export type GuildSidebarProps = {
  guildId: string;
};

const GuildSidebar: FC<GuildSidebarProps> = ({ guildId }) => {
  const dispatch = useAppDispatch();
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const activeChannelId = useAppSelector((state) => state.session.activeChannelId);
  const unreadFlags = useAppSelector((state) => state.session.unreadChannelFlags);

  const {
    data: guild,
    isSuccess,
    isFetching,
  } = useQuery({
    queryKey: ['guild', guildId],
    queryFn: async () => {
      const response = await apiQueries.guildQueries.getGuild(guildId!);
      return response.data;
    },
    enabled: !!guildId,
  });

  const initialChannelQuery = useQuery({
    queryKey: ['g-channel', guild?.channels![0]],
    queryFn: async () => {
      const formattedChannel = formatGuildChannel(guildId, guild?.channels![0].id!);
      const response = await apiQueries.channelQueries.getChannel(formattedChannel);
      return response.data;
    },
    enabled: false,
  });

  useEffect(() => {
    if (!guild || !isSuccess) return;

    if (!guild.channels || guild.channels.length <= 0) {
      dispatch(
        setChatChannel({
          channelContext: { type: 'text', title: '' },
          messages: [],
        }),
      );
      return;
    }

    initialChannelQuery.refetch();
  }, [guild, isSuccess]);

  useEffect(() => {
    if (!initialChannelQuery.data || !initialChannelQuery.isSuccess) return;

    const channel = initialChannelQuery.data;

    dispatch(setActiveChannel({ type: 'guild', channelId: channel.id, guildId: guild?.guildId }));
    dispatch(
      setChatChannel({
        channelContext: {
          type: 'text',
          title: channel.name,
        },
        messages: channel.messages ?? [],
      }),
    );
    dispatch(setContentVariant('chat'));
  }, [initialChannelQuery.data, initialChannelQuery.isSuccess]);

  if (isFetching || !guild) return <div className={styles.GuildSidebar}>Loading sidebar</div>;

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
        <OptionsMenu isOpen={isOptionsOpen} setIsOpen={setIsOptionsOpen} headerRef={headerRef} guild={guild} />
      </div>
      {guild.banner && <div className={styles.BannerWhitespace} aria-label="hidden" /> /* whitespace for banner */}
      <div className={styles.ChannelsContainer}>{channelList(guild)}</div>
    </div>
  );
};

export default GuildSidebar;
