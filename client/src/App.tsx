import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainApp from '@components/MainApp/MainApp';
import { Route, Routes } from 'react-router';
import { routesConfig } from './routes/config';
import ProtectedRoute from '@components/ProtectedRoute/ProtectedRoute';
import LoginPage from './routes/Login';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path={routesConfig.HOME} element={ProtectedRoute(<MainApp />)} />
        {/* Auth test route */}
        <Route path={routesConfig.APP} element={ProtectedRoute(<MainApp />)} />
        <Route path={routesConfig.LOGIN} element={<LoginPage />} />
      </Routes>
    </QueryClientProvider>
  );
};

export default App;
