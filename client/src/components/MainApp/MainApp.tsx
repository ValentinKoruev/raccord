import axios from 'axios';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import config from 'src/config';
import { GuildDto } from '@shared/types/dto/Guild';
import { GetUserGuildsResponse } from '@shared/types/getUserGuilds';
import Content from '@components/Content';
import Sidebar from '@components/Sidebar';
import styles from './MainApp.module.scss';

const MainApp = () => {
  const [guilds, setGuilds] = useState<Array<GuildDto>>([]);
  // TODO: Send connected user information when auth is added.
  const { data, isSuccess } = useQuery<GetUserGuildsResponse, Error>({
    queryKey: ['guilds', '1'],
    queryFn: async () => {
      const response = await axios.get<[]>(`${config.apiUrl}/user/guilds`);
      return response.data;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setGuilds(data);
    }
  }, [isSuccess, data]);

  return (
    <div className={styles.AppContainer}>
      <Sidebar guilds={guilds} />
      <Content />
    </div>
  );
};

export default MainApp;
