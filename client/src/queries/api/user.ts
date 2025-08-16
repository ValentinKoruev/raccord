import config from 'src/config';
import axios from '@queries/axios';
import { GetUserDirectResponse, GetUserGuildsResponse } from '@shared/types/api';

const userQueries = {
  async getUserGuilds() {
    return await axios.get<GetUserGuildsResponse>(`${config.apiUrl}/users/guilds`, { withCredentials: true });
  },
  async getUserDirect() {
    return await axios.get<GetUserDirectResponse>(`${config.apiUrl}/users/direct`);
  },
};

export default userQueries;
