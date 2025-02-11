import { ProfilePagePaper } from '@/assets/assets';
import { useEffect, useState } from 'react';
import { getPaperText } from '@/utils/getPaperText';
import Header from '@/components/common/Header/Header';
import { ProfileDropdown } from '@/components/Profile/ProfileDropdown';
import ProfileInfo from '@/components/Profile/ProfileInfo';
import ProfileIntroduction from '@/components/Profile/ProfileIntroduction';
import { useParams } from 'react-router-dom';
import { useUserStore } from '@/store/useUserStore';
import { User } from '@/types/user';
import { getUserProfile } from '@/api/user';
import LoadingSpinner from '@/components/common/Loading/LoadingSpinner';

const ProfilePage = () => {
  const { personalId } = useParams(); // URL 파라미터
  const { user: currentUser } = useUserStore(); // 현재 로그인한 유저저

  const [paperImage, setPaperImage] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 본인 프로필인지 확인
  const isMyProfile = currentUser.personalId === personalId;

  const handleMenuClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (personalId) {
          const data = await getUserProfile(personalId);
          setProfileData(data);

          // 프로필 데이터를 받아온 후 종이 이미지 생성
          const image = await getPaperText(data.name, 192);
          setPaperImage(image);
        }
      } catch (error) {
        console.error('프로필 데이터 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [personalId]);

  if (isLoading || !profileData) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container-header-nav overflow-hidden">
      <Header
        left="home"
        right={isMyProfile ? 'menu' : undefined}
        onMenuClick={isMyProfile ? handleMenuClick : undefined}
      />
      {isMyProfile && (
        <ProfileDropdown
          isOpen={isDropdownOpen}
          onClose={() => setIsDropdownOpen(false)}
        />
      )}
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
