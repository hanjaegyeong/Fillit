import { Navigate, Outlet } from 'react-router-dom';

const RequireAuth = () => {
  const accessToken = localStorage.getItem('accessToken');
  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
