import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const token = sessionStorage.getItem('accessToken');
  return token ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
