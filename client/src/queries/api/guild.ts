import config from 'src/config';
import axios from '@queries/axios';
import { GetGuildResponse } from '@shared/types/api';

const guildQueries = {
  async getGuild(guildId: string) {
    return await axios.get<GetGuildResponse>(`${config.apiUrl}/guild/${guildId}`);
  },
};

export default guildQueries;
