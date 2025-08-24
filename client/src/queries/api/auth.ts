import config from '@config';
import axios from 'axios';

const authQueries = {
  async login(form: { username: string; password: string }) {
    return await axios.post(`${config.apiUrl}/auth/login`, form);
  },
};

export default authQueries;
