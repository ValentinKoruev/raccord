import { useMutation } from '@tanstack/react-query';
import { useAppDispatch } from '@redux/store';
import { setChatChannel } from '@redux/slices/chatSlice';
import { setActiveChannel, setTabGuild } from '@redux/slices/sessionSlice';
import apiQueries from '@queries/api';
import { formatGuildChannel } from '@shared/utils/channelFormatter';

const useMutate = ({ setSidebar }: { setSidebar: any }) => {
  const dispatch = useAppDispatch();

  const guildMutate = useMutation({
    mutationFn: async (guildId: string) => {
      const response = await apiQueries.guildQueries.getGuild(guildId);

      return response.data;
    },
    onSuccess: async (guild) => {
      if (!guild) return;

      dispatch(setTabGuild(guild.guildId));
      setSidebar({ type: 'guild', currentGuild: guild });

      if (!guild.channels || guild.channels.length <= 0) {
        dispatch(
          setChatChannel({
            channelName: null,
            messages: [],
          }),
        );
        return;
      }

      //! NOTE: this triggers error when no channel is found, handle in onError in the future
      const channelResponse = await apiQueries.channelQueries.getChannel(
        formatGuildChannel(guild.guildId, guild.channels[0].id),
      );

      // TODO: Change it to last visited channel when it is supported
      const initialGuildChannel = channelResponse.data;

      // TODO: expand this error handler
      if (!initialGuildChannel) {
        console.error('Error: Channel not found');
        dispatch(
          setChatChannel({
            channelName: null,
            messages: [],
          }),
        );
        return;
      }

      dispatch(setActiveChannel({ type: 'guild', channelId: initialGuildChannel.id, guildId: guild.guildId }));
      dispatch(
        setChatChannel({
          channelName: initialGuildChannel.name,
          messages: initialGuildChannel.messages,
        }),
      );
    },
  });

  return guildMutate;
};

export default useMutate;
