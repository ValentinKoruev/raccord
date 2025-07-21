import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { GetUserGuildsRequest, GetUserGuildsResponse } from '@shared/types/getUserGuilds';
import GuildListElement, { GuildListElementProps } from '@components/Sidebar/GuildList/GuildListElement';
import styles from './GuildList.module.scss';

const GuildList = () => {
  const [guilds, setGuilds] = useState<GuildListElementProps[]>([]);

  // TODO: Send connected user information when auth is added.
  const { data, isSuccess, error } = useQuery<GetUserGuildsResponse, Error>({
    queryKey: ['messages', '1'],
    queryFn: async () => {
      const response = await axios.get<[]>(`http://localhost:4000/user/guilds`);
      return response.data;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isSuccess && data) {
      const guilds: GuildListElementProps[] = data.map((guild) => ({
        image: guild.icon!,
        tooltip: guild.guildName,
      }));

      setGuilds(guilds);
    }
  }, [isSuccess, data]);

  if (error) return <p>Error loading guilds: {error.message}</p>;

  return (
    <div className={styles.ListContainer}>
      {guilds.map((guild, index) => (
        <GuildListElement key={`guild-${index}`} image={`${guild.image}`} tooltip={`${guild.tooltip}`} />
      ))}
    </div>
  );
};

export default GuildList;
