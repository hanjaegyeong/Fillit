import ProfileImage from '@/components/common/ProfileImage';
import BackButton from './Button/BackButton';
import LogoButton from './Button/LogoButton';
import NotificationButton from './Button/NotificationButton';
import MenuTabButton from './Button/MenuTabButton';
import RegistButton from './Button/RegistButton';

interface HeaderProps {
  left: 'back' | 'home';
  profileImage?: string;
  text?: string;
  isTitle?: boolean;
  right?: 'notification' | 'menu' | 'regist';
}

const Header = ({
  left,
  profileImage,
  text,
  isTitle = false,
  right,
}: HeaderProps) => {
  return (
    <header className="top-0 h-[57px] bg-white border-b flex justify-between items-center px-4">
      <div className="flex gap-3 flex items-center">
        {left === 'back' && <BackButton />}
        {left === 'home' && <LogoButton />}
        {profileImage && <ProfileImage src={profileImage} />}
        <div className={isTitle ? `font-semibold text-xl` : `font-medium`}>
          {text}
        </div>
      </div>
      {right === 'notification' && <NotificationButton />}
      {right === 'menu' && <MenuTabButton />}
      {right === 'regist' && <RegistButton />}
    </header>
  );
};

export default Header;
