import { useMutation } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@redux/store';
import { setChatChannel } from '@redux/slices/chatSlice';
import { setTabDirect } from '@redux/slices/sessionSlice';
import apiQueries from '@queries/api';

const useDirectMutate = ({ setSidebar }: { setSidebar: any }) => {
  const dispatch = useAppDispatch();
  const activeDirectChannelId = useAppSelector((state) => state.session.activeDirectChannelId);

  const directMutate = useMutation({
    mutationFn: async () => {
      const response = await apiQueries.userQueries.getUserDirect();

      return response.data;
    },
    onSuccess: async (directChannels) => {
      const directChannelsProps = directChannels.map((d) => ({
        publicId: d.publicId,
        name: d.name,
        icon: d.icon ?? d.name[0],
      }));

      if (activeDirectChannelId) {
        try {
          const response = await apiQueries.channelQueries.getChannel(activeDirectChannelId);
          const activeChannel = response.data;

          dispatch(
            setChatChannel({
              channelName: activeChannel?.name,
              messages: activeChannel?.messages,
            }),
          );
        } catch (err) {
          dispatch(
            setChatChannel({
              channelName: null,
              messages: [],
            }),
          );
        }
      }

      dispatch(setTabDirect());
      setSidebar({ type: 'direct', friends: directChannelsProps });
    },
  });

  return directMutate;
};

export default useDirectMutate;
