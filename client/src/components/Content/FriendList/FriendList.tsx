import { useMutation, useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@redux/store';
import { setChatChannel } from '@redux/slices/content/chatSlice';
import { setActiveChannel } from '@redux/slices/sessionSlice';
import { setContentVariant } from '@redux/slices/content';
import apiQueries from '@queries/api';
import { GetChannelResponse } from '@shared/types/api';
import { UserDto } from '@shared/types/dto/User';
import styles from './FriendList.module.scss';

const FriendList = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const { data: friends, isFetching } = useQuery<UserDto[], Error>({
    queryKey: ['friends'],
    queryFn: async () => {
      const response = await apiQueries.userQueries.getUserFriends();
      return response.data;
    },
    refetchOnWindowFocus: true,
    enabled: !!auth.user, // only fetch if logged in
  });

  const friendMutate = useMutation({
    mutationFn: async (friendId: string): Promise<GetChannelResponse> => {
      const response = await apiQueries.channelQueries.getFriendChannel(friendId);
      return response.data;
    },
    onSuccess: async (channel) => {
      // TODO: expand this error handler or handle it in onError
      if (!channel) {
        console.assert('Error: No channel found');
        return;
      }

      dispatch(setActiveChannel({ type: 'direct', channelId: channel.id }));
      dispatch(
        setChatChannel({
          channelName: channel.name,
          messages: channel.messages,
        }),
      );
      dispatch(setContentVariant('chat'));
    },
  });

  if (!friends || isFetching) return <div className={styles.FriendListContainer}>Loading friends</div>;

  return (
    <div className={styles.FriendListContainer}>
      <div className={styles.Header}>Friends</div>
      <div className={styles.Friends}>
        <div className={styles.FriendsLabel}>All friends - {friends.length}</div>
        <ul className={styles.FriendList}>
          {friends.map((f) => (
            <li key={f.publicId} onClick={() => friendMutate.mutate(f.publicId)} className={styles.FriendListElement}>
              <div className={styles.IconWrapper}>
                <img src={f.icon} alt={`${f.name} pfp`} />
              </div>
              <span className={styles.FriendName}>{f.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FriendList;
