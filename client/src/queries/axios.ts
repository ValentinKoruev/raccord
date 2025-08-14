import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:4000', // change to your API URL
  withCredentials: true, // send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
