import { Route, Routes } from 'react-router';
import MainApp from '@routes/MainApp';
import LoginPage from '@routes/Login';
import RegisterPage from '@routes/Register';
import routes from '@routes/config';
import ProtectedRoute from '@components/Auth/ProtectedRoute';

const App = () => {
  return (
    <Routes>
      <Route path={routes.HOME} element={ProtectedRoute(<MainApp />)} />
      {/* Auth test route */}
      <Route path={routes.APP} element={ProtectedRoute(<MainApp />)} />
      <Route path={routes.LOGIN} element={<LoginPage />} />
      <Route path={routes.REGISTER} element={<RegisterPage />} />
    </Routes>
  );
};

export default App;
