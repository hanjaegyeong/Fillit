import homeInactiveIcon from '@/assets/icons/home-outline.svg';
import homeActiveIcon from '@/assets/icons/home-fill.svg';
import voiceInactiveIcon from '@/assets/icons/voice-outline.svg';
import voiceActiveIcon from '@/assets/icons/voice-fill.svg';
import searchInactiveIcon from '@/assets/icons/search-outline.svg';
import searchActiveIcon from '@/assets/icons/search-fill.svg';
import messageInactiveIcon from '@/assets/icons/message-outline.svg';
import messageActiveIcon from '@/assets/icons/message-fill.svg';
import myPageInactiveIcon from '@/assets/icons/mypage-outline.svg';
import myPageActiveIcon from '@/assets/icons/mypage-fill.svg';
import NavBarItem from './NavBarItem';
import { useLocation } from 'react-router-dom';

const navItems = [
  {
    inactiveIcon: homeInactiveIcon,
    activeIcon: homeActiveIcon,
    alt: 'home icon',
    to: '/',
  },
  {
    inactiveIcon: voiceInactiveIcon,
    activeIcon: voiceActiveIcon,
    alt: 'voice icon',
    to: '/voice',
  },
  {
    inactiveIcon: searchInactiveIcon,
    activeIcon: searchActiveIcon,
    alt: 'search icon',
    to: '/search',
  },
  {
    inactiveIcon: messageInactiveIcon,
    activeIcon: messageActiveIcon,
    alt: 'message icon',
    to: '/message',
  },
  {
    inactiveIcon: myPageInactiveIcon,
    activeIcon: myPageActiveIcon,
    alt: 'myPage icon',
    to: '/profile',
  },
];

const NavBar = () => {
  const { pathname } = useLocation();
  const excludedPaths = ['/login'];

  return excludedPaths.includes(pathname) ? (
    <></>
  ) : (
    <nav className="fixed z-1 h-24 bottom-0 w-full bg-white border-t">
      <div className="flex justify-around">
        {navItems.map((item, index) => (
          <NavBarItem
            key={index}
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
