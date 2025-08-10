import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router';
import { routesConfig } from 'src/routes/config';

const ProtectedRoute = (children: JSX.Element) => {
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to={routesConfig.LOGIN} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
