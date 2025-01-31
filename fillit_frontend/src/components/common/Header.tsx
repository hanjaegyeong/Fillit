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
  onSearch?: (term: string) => void;
  searchPlaceholder?: string;
}

const Header = ({
  left,
  profileImage,
  text,
  isTitle = false,
  right,
  center,
  onSearch,
  searchPlaceholder = 'Search',
}: HeaderProps) => {
  return (
    <header className="fixed w-full top-0 h-[3.6rem] bg-white border-b flex justify-between items-center px-4">
      <div className="flex gap-3 flex items-center">
        {left === 'back' && <BackButton />}
        {left === 'home' && <LogoButton />}
        {profileImage && <ProfileImage src={profileImage} />}
        <div className={isTitle ? `font-semibold text-xl` : `font-medium`}>
          {text}
        </div>
      </div>
      <div>
        {center === 'search' && onSearch && (
          <SearchInput
            onSearch={onSearch}
            placeholder={searchPlaceholder}
            width="w-[353px]"
          />
        )}
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
