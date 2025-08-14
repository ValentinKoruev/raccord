import { TokenData } from '@shared/types/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from '@queries/axios';
import { AxiosError, isAxiosError } from 'axios';
import Cookies from 'js-cookie';
import { UNAUTHORIZED } from 'src/queries/statusCodes';
import { setAuth } from 'src/redux/slices/authSlice';
import { routesConfig } from './config';
import { useDispatch } from 'react-redux';

interface LoginFormData {
  username: string;
  password: string;
}

// simple demo login page for testing auth
const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginFormData>({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.username || !form.password) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/auth/login', form);
      const data: TokenData = response.data;

      Cookies.set('raccord_session', data.accessToken, { expires: 1, secure: true, sameSite: 'Strict' });

      dispatch(setAuth(data));

      navigate(routesConfig.HOME);
    } catch (error) {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError;

        if (axiosError.status == UNAUTHORIZED) {
          setError('Username or password are wrong');
          return;
        }
      }

      throw new Error('Unexpecter Error: ' + error);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="email">Email</label>
          <br />
          <input
            type="text"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            style={{ width: '100%', padding: 8 }}
            required
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="password">Password</label>
          <br />
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            style={{ width: '100%', padding: 8 }}
            required
            minLength={6}
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        <button type="submit" style={{ padding: '10px 20px' }}>
          Log In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
