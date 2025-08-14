import axios from '@queries/axios';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import config from 'src/config';
import { GuildDto } from '@shared/types/dto/Guild';
import { GetUserGuildsResponse } from '@shared/types/getUserGuilds';
import Content from '@components/Content';
import Sidebar from '@components/Sidebar';
import styles from './MainApp.module.scss';
import { useAppSelector } from 'src/redux/store';
import { useNavigate } from 'react-router';
import { routesConfig } from 'src/routes/config';

const MainApp = () => {
  const navigate = useNavigate();
  const [guilds, setGuilds] = useState<Array<GuildDto>>([]);
  const auth = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!auth.user) {
      navigate(routesConfig.LOGIN);
    }
  }, [auth.user, navigate]);

  const { data, isSuccess } = useQuery<GetUserGuildsResponse, Error>({
    queryKey: ['userguilds', auth.user?.userId],
    queryFn: async () => {
      const response = await axios.get<[]>(`${config.apiUrl}/users/guilds`, { withCredentials: true });
      return response.data;
    },
    staleTime: Infinity, // this needs to be invalided on logout
    refetchOnWindowFocus: false,
    enabled: !!auth.user, // only fetch if logged in
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
