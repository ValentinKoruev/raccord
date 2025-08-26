import config from '@config';
import axios from '@queries/axios';
import { GetGuildResponse } from '@shared/types/api';

const guildQueries = {
  async getGuild(guildId: string) {
    return await axios.get<GetGuildResponse>(`${config.apiUrl}/guild/${guildId}`);
  },
  async createGuild(data: { guildName: string; guildIcon?: string }) {
    return await axios.post(`${config.apiUrl}/guild/create`, data);
  },
  async join(data: { guildId: string }) {
    return await axios.post(`${config.apiUrl}/guild/join`, data);
  },
  async leaveGuild(data: { guildId: string }) {
    return await axios.post(`${config.apiUrl}/guild/leave`, data);
  },
};

export default guildQueries;
