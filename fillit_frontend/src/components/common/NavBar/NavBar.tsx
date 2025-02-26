import { useLocation } from 'react-router-dom';
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
import NavBarItem from '@/components/common/NavBar/NavBarItem';
import { useUserStore } from '@/store/useUserStore';
import useNavStore from '@/store/useNavStore';

const NavBar = () => {
  const { user } = useUserStore();
  const location = useLocation();
  const { activeNavItem } = useNavStore();

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
      to: `/profile/${user?.personalId}`,
    },
  ];

  // 현재 경로가 navItems 중 하나와 일치하는지 확인
  const matchedNavItem = navItems.find((item) => {
    // myPage 항목은 '/profile'로 시작하면 활성화
    if (item.navItemId === 'myPage') {
      return location.pathname.startsWith('/profile');
    }
    return item.to === location.pathname;
  });

  // 경로가 일치하면 그 항목을 active, 아니라면 전역 상태를 사용
  const activeNavId = matchedNavItem ? matchedNavItem.navItemId : activeNavItem;

  return (
    <nav className="fixed z-1 h-[6rem] bottom-0 w-full bg-white border-t px-1">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <NavBarItem
            key={item.navItemId}
            navItemId={item.navItemId}
            inactiveIcon={item.inactiveIcon}
            activeIcon={item.activeIcon}
            alt={item.alt}
            to={item.to}
            isActiveOverride={activeNavId === item.navItemId}
          />
        ))}
      </div>
    </nav>
  );
};

export default NavBar;
