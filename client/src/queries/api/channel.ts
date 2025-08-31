import config from '@config';
import axios from '../axios';
import { GetChannelResponse } from '@shared/types/api';

const channelQueries = {
  async getChannel(channelId: string) {
    return await axios.get<GetChannelResponse>(`${config.apiUrl}/channels/${channelId}`);
  },
  async getFriendChannel(friendId: string) {
    return await axios.get<GetChannelResponse>(`${config.apiUrl}/channels/friends/${friendId}`);
  },
};

export default channelQueries;
