import { FC } from 'react';
import { useMutation } from '@tanstack/react-query';
import classNames from 'classnames';
import { useAppDispatch } from '@redux/store';
import { setChatChannel } from '@redux/slices/chatSlice';
import { setActiveChannel } from '@redux/slices/sessionSlice';
import apiQueries from '@queries/api';
import { GetChannelResponse } from '@shared/types/api';
import { formatDirectChannel } from '@shared/utils/channelFormatter';
import styles from './Friend.module.scss';

export type FriendProps = {
  userId: string;
  image: string;
  name: string;
  isActive?: boolean;
  isUnread?: boolean;
};

// TODO: refactor this for better reusablity, example usage: direct messages sidebar, guild member list, mutual friends, etc...
const Friend: FC<FriendProps> = ({ image, name, userId, isActive, isUnread }) => {
  const dispatch = useAppDispatch();

  const friendMutate = useMutation({
    mutationFn: async (channelId: string): Promise<GetChannelResponse> => {
      const response = await apiQueries.channelQueries.getChannel(formatDirectChannel(channelId));
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
    },
  });

  return (
    <div
      onClick={() => friendMutate.mutate(userId)}
      className={classNames(styles.Friend, isActive ? styles.isActive : '', isUnread ? styles.isUnread : '')}
    >
      {/* TODO: create a pfp component */}
      <div className={styles.ImageWrapper}>
        <img className={styles.Image} src={image} alt={`${name} (pfp)`} />
      </div>
      <div className={styles.FriendName}>
        <span>{name}</span>
      </div>
    </div>
  );
};

export default Friend;
