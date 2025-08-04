import { Dispatch, SetStateAction, FC } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import config from 'src/config';
import { useAppDispatch } from 'src/redux/store';
import { setChatChannel } from 'src/redux/slices/chatSlice';
import { SidebarState } from '../Sidebar';
import { GuildDto } from '@shared/types/dto/Guild';
import { GetGuildResponse } from '@shared/types/getGuild';
import { GetChannelResponse } from '@shared/types/getChannel';
import GuildListElement from '@components/Sidebar/GuildList/GuildListElement';
import styles from './GuildList.module.scss';

type GuildListProps = {
  guilds: Array<GuildDto>;
  setSidebar: Dispatch<SetStateAction<SidebarState>>;
};

const GuildList: FC<GuildListProps> = ({ guilds, setSidebar }) => {
  const dispatch = useAppDispatch();

  const guildMutate = useMutation({
    mutationFn: async (guildId: number): Promise<GetGuildResponse> => {
      const response = await axios.get(`${config.apiUrl}/guild/${guildId}`);

      return response.data;
    },
    onSuccess: async (guild) => {
      if (!guild) return;

      setSidebar({ type: 'guild', currentGuild: guild });

      if (guild.channels) {
        const channelResponse = await axios.get<GetChannelResponse>(`${config.apiUrl}/channel/${guild.channels[0].id}`);

        // TODO: Change it to last visited channel when it is supported
        const initialGuildChannel = channelResponse.data;

        // TODO: expand this error handler
        if (!initialGuildChannel) {
          console.assert('Error: No channel found');
          return;
        }

        dispatch(
          setChatChannel({
            channelName: initialGuildChannel.name,
            channelId: initialGuildChannel.id,
            messages: initialGuildChannel.messages,
          }),
        );
      }
    },
  });

  const onDirectMessagesClick = () => {
    setSidebar({ type: 'direct' });
  };

  const onGuildClick = (guild: GuildDto) => {
    guildMutate.mutate(guild.guildId);
  };

  return (
    <div className={styles.ListContainer}>
      <GuildListElement onClick={() => onDirectMessagesClick()} name="Direct Messages" />
      {guilds.map((guild, index) => (
        <GuildListElement
          onClick={() => onGuildClick(guild)}
          key={`guild-${index}`}
          name={`${guild.guildName}`}
          guildId={guild.guildId}
          image={`${guild.icon}`}
        />
      ))}
    </div>
  );
};

export default GuildList;
