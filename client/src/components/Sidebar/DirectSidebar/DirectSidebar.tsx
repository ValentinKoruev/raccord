import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '@redux/store';
import { setChatChannel } from '@redux/slices/content/chatSlice';
import { setContentVariant } from '@redux/slices/content';
import { setActiveChannel } from '@redux/slices/sessionSlice';
import apiQueries from '@queries/api';
import { formatDirectChannel, parseChannel } from '@shared/utils/channelFormatter';
import Icon from '@components/UI/Icon';
import Friend from '@components/Friend';
import styles from './DirectSidebar.module.scss';

// may or may not rename this component later
const DirectSidebar = () => {
  const dispatch = useAppDispatch();
  const activeChanneldId = useAppSelector((state) => state.session.activeChannelId);
  const activeDirectChannelId = useAppSelector((state) => state.session.activeDirectChannelId);
  const unreadFlags = useAppSelector((state) => state.session.unreadChannelFlags);

  const {
    data: DMs,
    isSuccess: isDirectSuccess,
    isFetching: isDirectFetching,
  } = useQuery({
    queryKey: ['direct'],
    queryFn: async () => {
      const response = await apiQueries.userQueries.getUserDirect();
      return response.data;
    },
  });

  const {
    refetch: channelRefetch,
    data: channel,
    isSuccess: isChannelSuccess,
  } = useQuery({
    queryKey: ['d-channel', activeDirectChannelId],
    queryFn: async () => {
      const response = await apiQueries.channelQueries.getChannel(activeDirectChannelId!);
      return response.data;
    },
    enabled: false,
  });

  useEffect(() => {
    if (!DMs || !isDirectSuccess) return;

    try {
      if (parseChannel(activeDirectChannelId ?? '').type == 'direct') {
        channelRefetch();
        return;
      }
    } catch (_err) {}

    dispatch(setContentVariant('friends'));
  }, [DMs, isDirectSuccess]);

  useEffect(() => {
    // TODO: should render all friends component
    if (!channel || !isChannelSuccess) {
      return;
    }

    dispatch(
      setChatChannel({
        channelContext: {
          type: 'direct',
          title: channel.name,
          icon: channel.icon,
        },
        messages: channel.messages ?? [],
      }),
    );
    dispatch(setContentVariant('chat'));
  }, [channel, isChannelSuccess]);

  const handleFriendsClick = () => {
    dispatch(setActiveChannel({ type: 'direct', channelId: 'friends' }));
    dispatch(setContentVariant('friends'));
  };

  if (isDirectFetching) return <div className={styles.DirectSidebar}>Loading sidebar</div>;

  const directChannels = (directChannels: Array<any> | undefined) => {
    if (!directChannels || directChannels.length == 0)
      return <div className={styles.NoDirectMessages}>No direct messages found</div>;

    return directChannels.map((d) => {
      const formattedChannel = formatDirectChannel(d.publicId);

      return (
        <Friend
          key={d.publicId}
          name={d.name}
          image={d.icon}
          userId={d.publicId}
          isActive={activeChanneldId == formattedChannel}
          isUnread={unreadFlags[formattedChannel]}
        />
      );
    });
  };

  return (
    <div data-testid="direct-sidebar" className={styles.DirectSidebar}>
      <div></div>
      <div className={styles.DirectSidebarTabs}>
        <div
          onClick={handleFriendsClick}
          className={classNames(styles.DirectSidebarTab, activeChanneldId == 'friends' ? styles.Active : null)}
        >
          <Icon name="user-group" />
          <span>Friends</span>
        </div>
      </div>
      <div className={styles.DirectMessagesContainer}>
        <div className={styles.DirectMessagesHeader}>Direct Messages</div>
        <div className={styles.DirectMessagesList}>{directChannels(DMs)}</div>
      </div>
    </div>
  );
};

export default DirectSidebar;
