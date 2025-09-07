import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch } from '@redux/store';
import { setAuthFromObject } from '@redux/slices/authSlice';
import routes from '@routes/config';
import apiQueries from '@queries/api';
import { getColorFromTheme } from '@shared/utils/colorUtil';

const ProtectedRoute = (children: ReactNode) => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  // Only run query if we're actually in a protected route context
  const shouldCheckAuth = location.pathname !== routes.LOGIN && location.pathname !== routes.REGISTER;

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['loggedUser'],
    queryFn: async () => {
      const response = await apiQueries.authQueries.getUser();
      return response.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled: shouldCheckAuth,
  });

  if (isLoading) {
    return <div>Loading in...</div>;
  }

  if (!data || !isSuccess) {
    return <Navigate to={routes.LOGIN} state={{ from: location }} replace />;
  }

  dispatch(setAuthFromObject(data));
  document.documentElement.style.setProperty('--theme-color', getColorFromTheme(data.theme));
  return children;
};

export default ProtectedRoute;
