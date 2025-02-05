import ProfileImage from '@/components/common/ProfileImage';
import BackButton from '@/components/common/Button/BackButton';
import LogoButton from '@/components/common/Button/LogoButton';
import NotificationButton from '@/components/common/Button/NotificationButton';
import MenuTabButton from '@/components/common/Button/MenuTabButton';
import RegistButton from '@/components/common/Button/RegistButton';
import SearchInput from '@/components/common/Input/SearchInput';

interface HeaderProps {
  left?: 'back' | 'home';
  profileImage?: string;
  text?: string;
  isTitle?: boolean;
  right?: 'notification' | 'menu' | 'regist';
  center?: 'search';
  onSearch?: (term: string) => void;
  searchPlaceholder?: string;
  onMenuClick?: () => void;
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
  onMenuClick,
}: HeaderProps) => {
  return (
    <header className="fixed w-full top-0 h-[3.6rem] bg-white border-b flex justify-between items-center px-4 z-10">
      <div className="flex items-center gap-3">
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
      <div className="flex justify-end">
        {right === 'notification' && <NotificationButton />}
        {right === 'menu' && <MenuTabButton onClick={onMenuClick} />}
        {right === 'regist' && <RegistButton />}
      </div>
    </header>
  );
};

export default Header;
