import { NavLink } from 'react-router-dom';

interface NavBarItemProps {
  inactiveIcon: string;
  activeIcon: string;
  alt: string;
  to: string;
}

const NavBarItem = ({ inactiveIcon, activeIcon, alt, to }: NavBarItemProps) => {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <div>
          <img src={isActive ? activeIcon : inactiveIcon} alt={alt} />
        </div>
      )}
    </NavLink>
  );
};

export default NavBarItem;
