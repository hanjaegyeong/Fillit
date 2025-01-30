import {
  HomeInactiveIcon,
  HomeActiveIcon,
  VoiceInactiveIcon,
  VoiceActiveIcon,
  SearchInactiveIcon,
  SearchActiveIcon,
  MessageInactiveIcon,
  MessageActiveIcon,
  MyPageInactiveIcon,
  MyPageActiveIcon,
} from '@/assets/assets';
import NavBarItem from './NavBarItem';
import { useLocation } from 'react-router-dom';

const navItems = [
  {
    navItemId: 'home',
    inactiveIcon: HomeInactiveIcon,
    activeIcon: HomeActiveIcon,
    alt: 'home icon',
    to: '/',
  },
  {
    navItemId: 'voice',
    inactiveIcon: VoiceInactiveIcon,
    activeIcon: VoiceActiveIcon,
    alt: 'voice icon',
    to: '/voice',
  },
  {
    navItemId: 'search',
    inactiveIcon: SearchInactiveIcon,
    activeIcon: SearchActiveIcon,
    alt: 'search icon',
    to: '/search',
  },
  {
    navItemId: 'message',
    inactiveIcon: MessageInactiveIcon,
    activeIcon: MessageActiveIcon,
    alt: 'message icon',
    to: '/message',
  },
  {
    navItemId: 'myPage',
    inactiveIcon: MyPageInactiveIcon,
    activeIcon: MyPageActiveIcon,
    alt: 'myPage icon',
    to: '/profile',
  },
];

const NavBar = () => {
  const { pathname } = useLocation();
  const excludedPaths = ['/login', '/signup'];

  return excludedPaths.includes(pathname) ? (
    <></>
  ) : (
    <nav className="fixed z-1 h-24 bottom-0 w-full bg-white border-t">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <NavBarItem
            key={item.navItemId}
            inactiveIcon={item.inactiveIcon}
            activeIcon={item.activeIcon}
            alt={item.alt}
            to={item.to}
          />
        ))}
      </div>
    </nav>
  );
};

export default NavBar;
