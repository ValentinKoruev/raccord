import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { AxiosError, isAxiosError } from 'axios';
import Cookies from 'js-cookie';
import routes from '../config';
import { setAuthFromToken } from '@redux/slices/authSlice';
import apiQueries from '@queries/api';
import { UNAUTHORIZED } from '@queries/statusCodes';
import { TokenData } from '@shared/types/api';
import Form from '@components/UI/Form';

import styles from './Login.module.scss';

interface LoginFormData {
  username: string;
  password: string;
}

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values: LoginFormData) => {
    const response = await apiQueries.authQueries.login(values);
    const data: TokenData = response.data;

    Cookies.set('raccord_session', data.accessToken, { expires: 1, secure: true, sameSite: 'Strict' });

    dispatch(setAuthFromToken(data));

    navigate(routes.HOME);
  };

  const validate = (values: LoginFormData) => {
    if (!values.username.trim() || !values.password.trim()) return 'Please enter both username and password.';
    return null;
  };

  const formatError = (error: any) => {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.status == UNAUTHORIZED) {
        return 'Username and/or password are wrong';
      }
    }

    return null;
  };

  const onRegisterNavigate = () => {
    navigate(routes.REGISTER);
  };

  return (
    <div className={styles.LoginPage}>
      <div className={styles.FormContainer}>
        <div className={styles.Header}>
          <h1>Sign into Raccord</h1>
        </div>
        <Form<LoginFormData>
          initialValues={{ username: '', password: '' }}
          fields={[
            { name: 'username', label: 'Username', placeholder: 'Username...' },
            { name: 'password', label: 'Password', placeholder: 'Password...', type: 'password' },
          ]}
          onSubmit={handleSubmit}
          validate={validate}
          submitText="Sign in"
          testId="login-form"
          formatError={formatError}
          onBack={onRegisterNavigate}
          backButtonText="Register"
        />
      </div>
    </div>
  );
};

export default LoginPage;
