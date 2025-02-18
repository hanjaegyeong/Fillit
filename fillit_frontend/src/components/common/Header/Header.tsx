import ProfileImage from '@/components/common/ProfileImage';
import BackButton from '@/components/common/Button/BackButton';
import LogoButton from '@/components/common/Button/LogoButton';
import NotificationButton from '@/components/common/Button/NotificationButton';
import MenuTabButton from '@/components/common/Button/MenuTabButton';
import RegistButton from '@/components/common/Button/RegistButton';
import SubmitInput from '@/components/common/Input/SubmitInput';
import { NoProfile } from '@/assets/assets';
import { User } from '@/types/user';
import { DmButton } from '@/components/common/Button/DmButton';

interface HeaderProps {
  left?: 'back' | 'home';
  profileImage?: string;
  text?: string;
  isTitle?: boolean;
  right?: 'notification' | 'menu' | 'regist' | 'message';
  center?: 'search';
  profileData?: User;
  onSubmit?: (term: string) => void;
  onMenuClick?: () => void;
  onRegistClick?: () => void;
}

const Header = ({
  left,
  profileImage,
  text,
  isTitle = false,
  right,
  center,
  profileData,
  onSubmit = () => {},
  onMenuClick,
  onRegistClick,
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
      {center === 'search' && (
        <div className="w-full p-2">
          <SubmitInput type="search" onSubmit={onSubmit} placeholder="Search" />
        </div>
      )}
      <div className="flex justify-end">
        {right === 'notification' && <NotificationButton />}
        {right === 'menu' && <MenuTabButton onClick={onMenuClick} />}
        {right === 'regist' && <RegistButton onClick={onRegistClick} />}
        {right === 'message' && profileData && (
          <DmButton
            otherPersonalId={profileData.personalId}
            otherUserName={profileData.name}
            otherProfileImageUrl={profileData.profileImageUrl || NoProfile}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
