import { FC } from 'react';
import axios from '@queries/axios';
import classNames from 'classnames';
import config from 'src/config';
import { useMutation } from '@tanstack/react-query';
import { useAppDispatch } from 'src/redux/store';
import { setChatChannel } from 'src/redux/slices/chatSlice';
import { GetChannelResponse } from '@shared/types/getChannel';
import Icon from '@shared/components/Icon';
import styles from './Channel.module.scss';
import { parseChannel } from '@shared/utils/channelFormatter';
import { setActiveChannel } from 'src/redux/slices/sessionSlice';

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
      const response = await axios.get(`${config.apiUrl}/channels/${channelId}`);

      return response.data;
    },
    onSuccess: async (channel) => {
      // TODO: expand this error handler or handle it in onError
      if (!channel) {
        console.assert('Error: No channel found');
        return;
      }

      const channelInfo = parseChannel(channelId); // !NOTE: preferable avoid this and change it in the future
      if (channelInfo.type != 'guild') return;
      dispatch(setActiveChannel({ type: 'guild', channelId: channelInfo.channelId, guildId: channelInfo.guildId }));
      dispatch(
        setChatChannel({
          channelName: channel.name,
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
