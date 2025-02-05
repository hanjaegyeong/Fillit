import { Outlet } from 'react-router-dom';
import NavBar from '@/components/common/NavBar/NavBar';

const Layout = () => {
  return (
    <>
      <Outlet />
      <NavBar />
    </>
  );
};

export default Layout;
