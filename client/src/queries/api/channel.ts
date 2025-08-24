import config from '@config';
import axios from '../axios';
import { GetChannelResponse } from '@shared/types/api';

const channelQueries = {
  async getChannel(channelId: string) {
    return await axios.get<GetChannelResponse>(`${config.apiUrl}/channels/${channelId}`);
  },
};

export default channelQueries;
