import { Dispatch, SetStateAction, FC } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@redux/store';
import { setChatChannel } from '@redux/slices/chatSlice';
import { setTabDirect, setTabGuild, setActiveChannel, selectUnreadByGuilds } from '@redux/slices/sessionSlice';
import apiQueries from '@queries/api';
import { GuildDto } from '@shared/types/dto/Guild';
import { GetGuildResponse } from '@shared/types/api';
import { formatGuildChannel } from '@shared/utils/channelFormatter';
import GuildListElement from '@components/Sidebar/GuildList/GuildListElement';
import { SidebarState } from '../Sidebar';
import styles from './GuildList.module.scss';

type GuildListProps = {
  guilds: Array<GuildDto>;
  setSidebar: Dispatch<SetStateAction<SidebarState>>;
};

const GuildList: FC<GuildListProps> = ({ guilds, setSidebar }) => {
  const dispatch = useAppDispatch();
  const activeTabId = useAppSelector((state) => state.session.activeTabId);
  const unreadGuilds = useAppSelector(selectUnreadByGuilds);

  const guildMutate = useMutation({
    mutationFn: async (guildId: string): Promise<GetGuildResponse> => {
      const response = await apiQueries.guildQueries.getGuild(guildId);

      return response.data;
    },
    onSuccess: async (guild) => {
      if (!guild) return;

      setSidebar({ type: 'guild', currentGuild: guild });

      if (guild.channels) {
        const channelResponse = await apiQueries.channelQueries.getChannel(
          formatGuildChannel(guild.guildId, guild.channels[0].id),
        );

        // TODO: Change it to last visited channel when it is supported
        const initialGuildChannel = channelResponse.data;

        // TODO: expand this error handler
        if (!initialGuildChannel) {
          console.assert('Error: No channel found');
          return;
        }

        dispatch(setTabGuild(guild.guildId));
        dispatch(setActiveChannel({ type: 'guild', channelId: initialGuildChannel.id, guildId: guild.guildId }));
        dispatch(
          setChatChannel({
            channelName: initialGuildChannel.name,
            messages: initialGuildChannel.messages,
          }),
        );
      }
    },
  });

  const directMutate = useMutation({
    mutationFn: async () => {
      const response = await apiQueries.userQueries.getUserDirect();

      return response.data;
    },
    onSuccess: (directChannels) => {
      const directChannelsProps = directChannels.map((d) => ({
        publicId: d.publicId,
        name: d.name,
        icon: d.icon ?? d.name[0],
      }));

      dispatch(setTabDirect());
      // dispatch(setActiveChannel({type: 'direct', channelId: i}))
      setSidebar({ type: 'direct', friends: directChannelsProps });
    },
  });

  const onDirectMessagesClick = () => {
    directMutate.mutate();
  };

  const onGuildClick = (guild: GuildDto) => {
    guildMutate.mutate(guild.guildId);
  };

  return (
    <div className={styles.ListContainer}>
      <GuildListElement
        isActive={activeTabId == 'direct'}
        isUnread={unreadGuilds['direct'] !== undefined}
        onClick={() => onDirectMessagesClick()}
        image="src/assets/raccoon_creppy.png"
        name="Direct Messages"
      />
      {guilds.map((guild, index) => {
        return (
          <GuildListElement
            onClick={() => onGuildClick(guild)}
            key={`guild-${index}`}
            name={`${guild.guildName}`}
            guildId={guild.guildId}
            image={`${guild.icon}`}
            isActive={activeTabId == guild.guildId}
            isUnread={unreadGuilds[guild.guildId] !== undefined}
          />
        );
      })}
    </div>
  );
};

export default GuildList;
