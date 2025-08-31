import { Route, Routes } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainApp from '@routes/MainApp';
import LoginPage from '@routes/Login';
import RegisterPage from '@routes/Register';
import routes from '@routes/config';
import ProtectedRoute from '@components/Auth/ProtectedRoute';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path={routes.HOME} element={ProtectedRoute(<MainApp />)} />
        {/* Auth test route */}
        <Route path={routes.APP} element={ProtectedRoute(<MainApp />)} />
        <Route path={routes.LOGIN} element={<LoginPage />} />
        <Route path={routes.REGISTER} element={<RegisterPage />} />
      </Routes>
    </QueryClientProvider>
  );
};

export default App;
