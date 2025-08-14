import { Dispatch, SetStateAction, FC } from 'react';
import axios from '@queries/axios';
import { useMutation } from '@tanstack/react-query';
import config from 'src/config';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { setChatChannel } from 'src/redux/slices/chatSlice';
import { SidebarState } from '../Sidebar';
import { GuildDto } from '@shared/types/dto/Guild';
import { GetGuildResponse } from '@shared/types/getGuild';
import { GetChannelResponse } from '@shared/types/getChannel';
import GuildListElement from '@components/Sidebar/GuildList/GuildListElement';
import styles from './GuildList.module.scss';
import { formatGuildChannel } from '@shared/utils/channelFormatter';
import { setTabDirect, setTabGuild, setActiveChannel, selectUnreadByGuilds } from 'src/redux/slices/sessionSlice';
import { useSelector } from 'react-redux';

type GuildListProps = {
  guilds: Array<GuildDto>;
  setSidebar: Dispatch<SetStateAction<SidebarState>>;
};

const GuildList: FC<GuildListProps> = ({ guilds, setSidebar }) => {
  const dispatch = useAppDispatch();
  const activeTabId = useAppSelector((state) => state.session.activeTabId);
  const unreadGuilds = useSelector(selectUnreadByGuilds);

  const guildMutate = useMutation({
    mutationFn: async (guildId: string): Promise<GetGuildResponse> => {
      const response = await axios.get(`${config.apiUrl}/guild/${guildId}`);

      return response.data;
    },
    onSuccess: async (guild) => {
      if (!guild) return;

      setSidebar({ type: 'guild', currentGuild: guild });

      if (guild.channels) {
        const channelResponse = await axios.get<GetChannelResponse>(
          `${config.apiUrl}/channels/${formatGuildChannel(guild.guildId, guild.channels[0].id)}`,
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
      const response = await axios.get(`${config.apiUrl}/users/direct`);

      return response.data;
    },
    onSuccess: (directChannels: Array<any>) => {
      // !NOTE: Lord forgive me
      const directChannelsF = directChannels.map((d) => ({
        publicId: d.publicId,
        name: d.users[0].user.name,
        icon: d.users[0].user.icon,
      }));

      dispatch(setTabDirect());
      // dispatch(setActiveChannel({type: 'direct', channelId: i}))
      setSidebar({ type: 'direct', friends: directChannelsF });
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
