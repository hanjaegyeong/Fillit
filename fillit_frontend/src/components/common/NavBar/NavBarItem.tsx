import { NavLink } from 'react-router-dom';
import useNavStore from '@/store/useNavStore';

interface NavBarItemProps {
  navItemId: string;
  inactiveIcon: string;
  activeIcon: string;
  alt: string;
  to: string;
}

const NavBarItem = ({
  navItemId,
  inactiveIcon,
  activeIcon,
  alt,
  to,
}: NavBarItemProps) => {
  const { activeNavItem, setActiveNavItem } = useNavStore();

  return (
    <NavLink to={to} onClick={() => setActiveNavItem(navItemId)}>
      {({ isActive }) => {
        const finalActive = isActive || activeNavItem === navItemId;
        return (
          <div>
            <img src={finalActive ? activeIcon : inactiveIcon} alt={alt} />
          </div>
        );
      }}
    </NavLink>
  );
};

export default NavBarItem;
