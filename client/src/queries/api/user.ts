import config from '@config';
import axios from '@queries/axios';
import { GetUserDirectResponse, GetUserGuildsResponse } from '@shared/types/api';
import { UserDto } from '@shared/types/dto/User';

const userQueries = {
  async getUser() {
    return await axios.get(`${config.apiUrl}/users`);
  },
  async getUserGuilds() {
    return await axios.get<GetUserGuildsResponse>(`${config.apiUrl}/users/guilds`);
  },
  async getUserDirect() {
    return await axios.get<GetUserDirectResponse>(`${config.apiUrl}/users/direct`);
  },
  async getUserFriends() {
    return await axios.get<UserDto[]>(`${config.apiUrl}/users/friends`);
  },
};

export default userQueries;
