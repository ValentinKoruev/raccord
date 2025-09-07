import config from '@config';
import axios from '@queries/axios';
import { RegisterData } from '@shared/types/api';

const authQueries = {
  async login(form: { username: string; password: string }) {
    return await axios.post(`${config.apiUrl}/auth/login`, form);
  },
  async register(form: RegisterData) {
    return await axios.post(`${config.apiUrl}/auth/register`, form);
  },
  async logout() {
    return await axios.post(`${config.apiUrl}/auth/logout`);
  },
  async getUser() {
    return await axios.get(`${config.apiUrl}/auth/user`);
  },
};

export default authQueries;
