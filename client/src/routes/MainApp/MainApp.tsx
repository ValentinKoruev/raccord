import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '@redux/store';
import routes from '@routes/config';
import apiQueries from '@queries/api';
import { GuildDto } from '@shared/types/dto/Guild';
import { GetUserGuildsResponse } from '@shared/types/api';
import BaseModal from '@components/Modals';
import Content from '@components/Content';
import Sidebar from '@components/Sidebar';
import UserInfo from '@components/UserInfo';
import styles from './MainApp.module.scss';

const MainApp = () => {
  const navigate = useNavigate();
  const [guilds, setGuilds] = useState<Array<GuildDto>>([]);
  const auth = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!auth.user) {
      navigate(routes.LOGIN);
    }
  }, [auth.user, navigate]);

  const { data, isSuccess } = useQuery<GetUserGuildsResponse, Error>({
    queryKey: ['userguilds', auth.user?.userId],
    queryFn: async () => {
      const response = await apiQueries.userQueries.getUserGuilds();
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
      <BaseModal />
      <aside className={styles.Aside}>
        <Sidebar guilds={guilds} />
        <UserInfo />
      </aside>
      <Content />
    </div>
  );
};

export default MainApp;
