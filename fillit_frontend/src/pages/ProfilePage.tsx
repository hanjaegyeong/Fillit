import { useEffect, useState } from 'react';
import { getPaperText } from '@/utils/getPaperText';
import Header from '@/components/common/Header/Header';
import { ProfileDropdown } from '@/components/Profile/ProfileDropdown';
import ProfileInfo from '@/components/Profile/ProfileInfo';
import ProfileIntroduction from '@/components/Profile/ProfileIntroduction';
import { useParams } from 'react-router-dom';
import { useUserStore } from '@/store/useUserStore';
import LoadingOverlay from '@/components/common/Loading/LoadingOverlay';
import UserArticleListContainer from '@/components/Article/UserArticleListContainer';

type RouteParams = {
  personalId: string;
};
import { useGetProfile } from '@/hooks/query/useGetProfile';

const ProfilePage = () => {
  const { personalId } = useParams() as RouteParams; // URL 파라미터
  const { user: currentUser } = useUserStore(); // 현재 로그인한 유저저

  const [paperImage, setPaperImage] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data: profileData, isLoading } = useGetProfile(personalId ?? '');

  // 본인 프로필인지 확인
  const isMyProfile = currentUser.personalId === personalId;

  const handleMenuClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const generatePaperImage = async () => {
      if (profileData?.name) {
        const image = await getPaperText(profileData.name, 192);
        setPaperImage(image);
      }
    };
    generatePaperImage();
  }, [profileData?.name]);

  if (isLoading || !profileData) {
    return <LoadingOverlay />;
  }

  return (
    <div className="container-header-nav">
      <Header
        left="home"
        right={isMyProfile ? 'menu' : 'message'}
        profileData={profileData}
        onMenuClick={isMyProfile ? handleMenuClick : undefined}
      />
      {isMyProfile && (
        <ProfileDropdown
          isOpen={isDropdownOpen}
          onClose={() => setIsDropdownOpen(false)}
        />
      )}
      <div className="w-full flex flex-col items-center overflow-x-hidden">
        <ProfileInfo
          profileData={profileData}
          paperImage={paperImage}
          isMyProfile={isMyProfile}
        />
        <ProfileIntroduction introduction={profileData.introduction} />
        <UserArticleListContainer personalId={personalId} />
        {/* <div className="flex justify-center scale-150 mt-24 mb-7 h-full">
        <img
          src={ProfilePagePaper}
          alt="profile page paper"
          className="h-full"
        />
      </div> */}
      </div>
    </div>
  );
};

export default ProfilePage;
