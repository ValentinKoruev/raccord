import { useAppSelector } from '@redux/store';
import { useQuery } from '@tanstack/react-query';
import apiQueries from '@queries/api';
import { GetGuildResponse } from '@shared/types/api';
import Icon from '@components/UI/Icon';
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

  return (
    <div className={styles.ExtraInfoContainer}>
      {guild.members?.map((m, index) => (
        <div key={`guild-member-${index}`} className={styles.ExtraInfoElement}>
          <div className={styles.IconWrapper}>
            <img src={m.icon} alt={`${m.name} pfp`} />
          </div>
          <span className={styles.Name}>{m.name}</span>
          {guild.ownerId == m.publicId && <Icon name="crown" className={styles.CrownIcon} />}
        </div>
      ))}
    </div>
  );
};

export default ExtraInfo;
