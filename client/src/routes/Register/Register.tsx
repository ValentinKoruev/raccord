import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { AxiosError, isAxiosError } from 'axios';
import Cookies from 'js-cookie';
import routes from '../config';
import { setAuthFromToken } from '@redux/slices/authSlice';
import apiQueries from '@queries/api';
import { BAD_REQUEST, CONFLICT } from '@queries/statusCodes';
import { TokenData } from '@shared/types/api';
import Form from '@components/UI/Form';

import styles from './Register.module.scss';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  repassword: string;
  icon: string;
}

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values: RegisterFormData) => {
    const response = await apiQueries.authQueries.register(values);
    const data: TokenData = response.data;

    Cookies.set('raccord_session', data.accessToken, { expires: 1, secure: true, sameSite: 'Strict' });

    dispatch(setAuthFromToken(data));

    navigate(routes.HOME);
  };

  const validate = (values: RegisterFormData) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const missingFields: Array<string> = [];

    if (!values.username.trim()) missingFields.push('username');
    if (!values.password.trim()) missingFields.push('password');
    if (!values.repassword.trim()) missingFields.push('repassword');
    if (!values.email.trim()) missingFields.push('email');

    if (missingFields.length > 0) {
      return `Required fields are missing: ${missingFields.join(', ')}`;
    }

    if (!emailRegex.test(values.email)) return 'Provided email is not a valid email address.';

    if (values.password !== values.repassword) return 'Passwords do not match.';
    return null;
  };

  const formatError = (error: any) => {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.status == BAD_REQUEST) {
        const data = error.response?.data as { message?: string };

        if (data?.message) return data.message;
      }

      if (axiosError.status == CONFLICT) {
        const data = error.response?.data as { message?: string };

        if (data?.message) return data.message;
      }
    }

    return null;
  };

  const onLoginNavigate = () => {
    navigate(routes.LOGIN);
  };

  return (
    <div className={styles.RegisterPage}>
      <div className={styles.FormContainer}>
        <div className={styles.Header}>
          <h1>Sign up for Raccord</h1>
        </div>
        <Form<RegisterFormData>
          initialValues={{ username: '', password: '', repassword: '', email: '', icon: '' }}
          fields={[
            { name: 'username', label: 'Username', placeholder: 'Username...' },
            { name: 'email', label: 'Email', placeholder: 'Email...' },
            { name: 'password', label: 'Password', placeholder: 'Password...', type: 'password' },
            { name: 'repassword', label: 'Repeat Password', placeholder: 'Repeat Password...', type: 'password' },
            { name: 'icon', label: 'Icon', placeholder: 'Icon...' },
          ]}
          onSubmit={handleSubmit}
          validate={validate}
          submitText="Sign up"
          testId="register-form"
          formatError={formatError}
          onBack={onLoginNavigate}
          backButtonText="Login"
        />
      </div>
    </div>
  );
};

export default RegisterPage;
