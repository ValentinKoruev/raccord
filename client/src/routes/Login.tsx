import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { AxiosError, isAxiosError } from 'axios';
import Cookies from 'js-cookie';
import routes from './config';
import { setAuth } from '@redux/slices/authSlice';
import apiQueries from '@queries/api';
import { UNAUTHORIZED } from '@queries/statusCodes';
import { TokenData } from '@shared/types/api';

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
      const response = await apiQueries.authQueries.login(form);
      const data: TokenData = response.data;

      Cookies.set('raccord_session', data.accessToken, { expires: 1, secure: true, sameSite: 'Strict' });

      dispatch(setAuth(data));

      navigate(routes.HOME);
    } catch (error) {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError;

        if (axiosError.status == UNAUTHORIZED) {
          setError('Username and/or password are wrong');
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
