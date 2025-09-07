import { useState } from 'react';
import classNames from 'classnames';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@redux/store';
import { setChatChannel } from '@redux/slices/content/chatSlice';
import { setActiveChannel } from '@redux/slices/sessionSlice';
import { setContentVariant } from '@redux/slices/content';
import apiQueries from '@queries/api';
import { GetChannelResponse } from '@shared/types/api';
import { UserDto } from '@shared/types/dto/User';
import FriendListTab from './FriendsListTab';
import AddFriendsTab from './AddFriendsTab';
import styles from './FriendList.module.scss';

type FriendTabState = 'allFriends' | 'addFriend';

const FriendList = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const [friendTab, setFriendTab] = useState<FriendTabState>('allFriends');

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
          channelContext: {
            type: 'direct',
            title: channel.name,
          },
          messages: channel.messages ?? [],
        }),
      );
      dispatch(setContentVariant('chat'));
    },
  });

  if (!friends || isFetching) return <div className={styles.FriendListContainer}>Loading friends</div>;

  const renderFriendTab = () => {
    switch (friendTab) {
      case 'allFriends': {
        return <FriendListTab friends={friends} friendMutate={friendMutate} />;
      }
      case 'addFriend': {
        return <AddFriendsTab />;
      }
    }
  };

  return (
    <div className={styles.FriendListContainer}>
      <div className={styles.Header}>
        <div onClick={() => setFriendTab('allFriends')} className={styles.FriendTabButton}>
          Friends
        </div>
        <div
          onClick={() => setFriendTab('addFriend')}
          className={classNames(styles.FriendTabButton, styles.AddFriendsButton)}
        >
          Add friend
        </div>
      </div>
      {renderFriendTab()}
    </div>
  );
};

export default FriendList;
