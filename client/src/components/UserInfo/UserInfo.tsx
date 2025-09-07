import { useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@redux/store';
import { openOptionsMenuModal } from '@redux/slices/modalSlice';
import apiQueries from '@queries/api';
import { UserDto } from '@shared/types/dto/User';
import Icon from '@components/UI/Icon';
import styles from './UserInfo.module.scss';

const UserInfo = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const {
    data: user,
    isSuccess,
    isFetching,
  } = useQuery<UserDto, Error>({
    queryKey: ['user', auth.user?.userId],
    queryFn: async () => {
      const response = await apiQueries.userQueries.getUser();
      return response.data;
    },
    enabled: !!auth.user, // only fetch if logged in
  });

  if (!isSuccess || isFetching) return <div>Loading User Info</div>;

  const onOptionsClick = () => {
    dispatch(openOptionsMenuModal({ type: 'user' }));
  };

  return (
    <div className={styles.UserInfoContainer}>
      <div className={styles.UserInfo}>
        <div className={styles.UserIconWrapper}>
          <img src={user.icon} alt={`${user.name} pfp`} />
        </div>
        <div className={styles.Username}>{user.name}</div>
      </div>
      <div className={styles.UserActions}>
        <button onClick={onOptionsClick} className={styles.UserOptions} type="button">
          <Icon name="gear" />
        </button>
      </div>
    </div>
  );
};

export default UserInfo;
