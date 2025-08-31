import config from '@config';
import { RegisterData } from '@shared/types/api';
import axios from 'axios';

const authQueries = {
  async login(form: { username: string; password: string }) {
    return await axios.post(`${config.apiUrl}/auth/login`, form);
  },
  async register(form: RegisterData) {
    return await axios.post(`${config.apiUrl}/auth/register`, form);
  },
};

export default authQueries;
