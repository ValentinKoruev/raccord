import { Dispatch, SetStateAction, FC } from 'react';
import { GuildDto } from '@shared/types/dto/Guild';
import GuildListElement from '@components/Sidebar/GuildList/GuildListElement';
import { SidebarState } from '../Sidebar';
import styles from './GuildList.module.scss';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import config from 'src/config';
import { GetGuildResponse } from '@shared/types/getGuild';
import { useAppDispatch } from 'src/redux/store';
import { setContentToChat } from 'src/redux/slices/contentSlice';
import { GetChannelResponse } from '@shared/types/getChannel';

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
          setContentToChat({
            variant: 'chat',
            content: { title: initialGuildChannel.name, messages: initialGuildChannel.messages ?? [] },
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
