import { ProfilePagePaper } from '@/assets/assets';
import { user } from '@/mocks/fixtures/user';
import { useEffect, useState } from 'react';
import { getPaperText } from '@/utils/getPaperText';
import Header from '@/components/common/Header/Header';
import { ProfileDropdown } from '@/components/Profile/ProfileDropdown';
import ProfileInfo from '@/components/Profile/ProfileInfo';
import ProfileIntroduction from '@/components/Profile/ProfileIntroduction';

const ProfilePage = () => {
  const [paperImage, setPaperImage] = useState<string | null>(null);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [profileData, setProfileData] = useState(user[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleProfile = () => {
    setIsMyProfile(!isMyProfile);
    setProfileData(!isMyProfile ? user[1] : user[0]);
  };

  const handleMenuClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const loadPaperText = async () => {
      const image = await getPaperText(profileData.name, 192);
      setPaperImage(image);
    };
    loadPaperText();
  }, [profileData]);

  return (
    <div className="container-header-nav overflow-hidden">
      <Header left="home" right="menu" onMenuClick={handleMenuClick} />
      <ProfileDropdown
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
      />
      <button
        onClick={toggleProfile}
        className="absolute top-15 right-4 bg-gray-100 px-1.5 py-0.5 rounded text-xs text-gray-600 hover:bg-gray-200 shadow-sm z-[9999]"
      >
        {isMyProfile ? '다른 유저 보기' : '내 프로필'}
      </button>
      <div className="w-full flex flex-col items-center">
        <ProfileInfo
          profileData={profileData}
          paperImage={paperImage}
          isMyProfile={isMyProfile}
        />
        <ProfileIntroduction introduction={profileData.introduction} />
        <div className="w-full object-cover flex justify-center scale-110 mt-[3rem]">
          <img src={ProfilePagePaper} alt="profile page paper" />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
