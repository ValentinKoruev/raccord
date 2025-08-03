import { FC } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import config from 'src/config';
import { useMutation } from '@tanstack/react-query';
import { useAppDispatch } from 'src/redux/store';
import { setChatChannel } from 'src/redux/slices/chatSlice';
import { GetChannelResponse } from '@shared/types/getChannel';
import Icon from '@shared/components/Icon';
import styles from './Channel.module.scss';

export type ChannelType = 'text' | 'voice';

export type ChannelProps = {
  channelId: string;
  name: string;
  type: ChannelType;
  isActive: boolean;
  isUnread: boolean;
};

const Channel: FC<ChannelProps> = ({ type, name, isActive, isUnread, channelId }) => {
  const dispatch = useAppDispatch();
  const iconSize = '1.4em';

  const channelMutate = useMutation({
    mutationFn: async (channelId: string): Promise<GetChannelResponse> => {
      const response = await axios.get(`${config.apiUrl}/channel/${channelId}`);

      return response.data;
    },
    onSuccess: async (channel) => {
      if (!channel) return;

      // TODO: expand this error handler
      if (!channel) {
        console.assert('Error: No channel found');
        return;
      }

      dispatch(
        setChatChannel({
          channelId: channel.id,
          messages: channel.messages,
        }),
      );
    },
  });

  const renderIcon = (type: ChannelType) => {
    switch (type) {
      case 'text':
        return <Icon name="hashtag" width={iconSize} height={iconSize} />;
      case 'voice':
        return <Icon name="volume-high" width={iconSize} height={iconSize} />;
    }
  };

  return (
    <div
      onClick={() => channelMutate.mutate(channelId)}
      className={classNames(styles.Channel, isActive ? styles.Active : '', isUnread ? styles.Unread : '')}
    >
      {renderIcon(type)}
      <div className={styles.ChannelName}>{name}</div>
      <div className={styles.OptionsMenu}>{/* options, create invites, chat for voice channels, etc.. */}</div>
    </div>
  );
};

export default Channel;
