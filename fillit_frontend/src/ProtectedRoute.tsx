import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = sessionStorage.getItem('accessToken');
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
