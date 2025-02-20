import { NavLink } from 'react-router-dom';
import useNavStore from '@/store/useNavStore';

interface NavBarItemProps {
  navItemId: string;
  inactiveIcon: string;
  activeIcon: string;
  alt: string;
  to: string;
  isActiveOverride: boolean;
}

const NavBarItem = ({
  navItemId,
  inactiveIcon,
  activeIcon,
  alt,
  to,
  isActiveOverride,
}: NavBarItemProps) => {
  const { setActiveNavItem } = useNavStore();

  return (
    <NavLink to={to} onClick={() => setActiveNavItem(navItemId)}>
      {({}) => {
        return (
          <div>
            <img
              src={isActiveOverride ? activeIcon : inactiveIcon}
              alt={alt}
              className="max-w-16"
            />
          </div>
        );
      }}
    </NavLink>
  );
};

export default NavBarItem;
