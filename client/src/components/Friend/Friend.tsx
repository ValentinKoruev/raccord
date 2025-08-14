import { FC } from 'react';
import axios from '@queries/axios';
import { useMutation } from '@tanstack/react-query';
import { GetChannelResponse } from '@shared/types/getChannel';
import { useAppDispatch } from 'src/redux/store';
import { setChatChannel } from 'src/redux/slices/chatSlice';
import config from 'src/config';
import { formatDirectChannel } from '@shared/utils/channelFormatter';
import { setActiveChannel } from 'src/redux/slices/sessionSlice';
import styles from './Friend.module.scss';

export type FriendProps = {
  userId: string;
  image: string;
  name: string;
};

// TODO: refactor this for better reusablity, example usage: direct messages sidebar, guild member list, mutual friends, etc...
const Friend: FC<FriendProps> = ({ image, name, userId }) => {
  const dispatch = useAppDispatch();

  const friendMutate = useMutation({
    mutationFn: async (channelId: string): Promise<GetChannelResponse> => {
      const response = await axios.get(`${config.apiUrl}/channels/${formatDirectChannel(channelId)}`); //? NOTE: passing unformated channelId, maybe make it default to formated?
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
    <div onClick={() => friendMutate.mutate(userId)} className={styles.Friend}>
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
