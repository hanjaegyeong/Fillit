import ProfileImage from '@/components/common/ProfileImage';
import BackButton from './Button/BackButton';
import LogoButton from './Button/LogoButton';
import NotificationButton from './Button/NotificationButton';
import MenuTabButton from './Button/MenuTabButton';
import RegistButton from './Button/RegistButton';
import SearchInput from './Button/SearchInput';

interface HeaderProps {
  left?: 'back' | 'home';
  profileImage?: string;
  text?: string;
  isTitle?: boolean;
  right?: 'notification' | 'menu' | 'regist';
  center?: 'search';
}

const Header = ({
  left,
  profileImage,
  text,
  isTitle = false,
  right,
  center,
}: HeaderProps) => {
  return (
    <header className="top-0 h-[57px] bg-white border-b flex justify-between items-center px-4">
      <div className="flex gap-3 items-center w-1/4">
        {left === 'back' && <BackButton />}
        {left === 'home' && <LogoButton />}
        {profileImage && <ProfileImage src={profileImage} />}
        <div className={isTitle ? `font-semibold text-xl` : `font-medium`}>
          {text}
        </div>
      </div>
      <div className="flex justify-center w-2/4">
        {center === 'search' && <SearchInput />}
      </div>
      <div className="flex justify-end w-1/4">
        {right === 'notification' && <NotificationButton />}
        {right === 'menu' && <MenuTabButton />}
        {right === 'regist' && <RegistButton />}
      </div>
    </header>
  );
};

export default Header;
