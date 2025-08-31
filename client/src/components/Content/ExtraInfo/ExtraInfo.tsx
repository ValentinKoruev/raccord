import { useAppSelector } from '@redux/store';
import { useQuery } from '@tanstack/react-query';
import apiQueries from '@queries/api';
import { GetGuildResponse } from '@shared/types/api';
import styles from './ExtraInfo.module.scss';

const ExtraInfo = () => {
  const activeTabId = useAppSelector((state) => state.session.activeTabId);

  const {
    data: guild,
    isSuccess,
    isFetching,
  } = useQuery<GetGuildResponse, Error>({
    queryKey: ['guild', activeTabId],
    queryFn: async () => {
      const response = await apiQueries.guildQueries.getGuild(activeTabId!);
      return response.data;
    },
    enabled: !!activeTabId && activeTabId !== 'direct',
  });

  if (!guild || !isSuccess || isFetching) return null;

  console.log(guild);

  return (
    <div className={styles.ExtraInfoContainer}>
      {guild.members?.map((e) => (
        <div className={styles.ExtraInfoElement}>
          <div className={styles.IconWrapper}>
            <img src={e.icon} alt={`${e.name} pfp`} />
          </div>
          <span className={styles.Name}>{e.name}</span>
        </div>
      ))}
    </div>
  );
};

export default ExtraInfo;
