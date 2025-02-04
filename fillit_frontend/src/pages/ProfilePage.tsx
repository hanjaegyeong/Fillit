import Header from '@/components/common/Header';
import ProfileImage from '@/components/common/ProfileImage';
import { ProfilePagePaper, RippedProfile } from '@/assets/assets';
import { user, anotherUser } from '@/mocks/fixtures/user';
import { useEffect, useState } from 'react';
import { getPaperText } from '@/utils/getPaperText';
import { DmButton } from '@/components/common/Button/DmButton';
import FollowButton from '@/components/common/Button/FollowButton';

const ProfilePage = () => {
  const [paperImage, setPaperImage] = useState<string | null>(null);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [profileData, setProfileData] = useState(user);

  const toggleProfile = () => {
    setIsMyProfile(!isMyProfile);
    setProfileData(!isMyProfile ? user : anotherUser);
  };

  useEffect(() => {
    const loadPaperText = async () => {
      const image = await getPaperText(profileData.name, 192);
      setPaperImage(image);
    };
    loadPaperText();
  }, [profileData]); // profileData가 변경될 때마다 실행

  return (
    <div className="container-header-nav overflow-hidden">
      <Header left="home" right="menu" />
      <div className="w-full flex flex-col items-center">
        <button
          onClick={toggleProfile}
          className="absolute top-15 right-4 bg-gray-100 px-1.5 py-0.5 rounded text-xs text-gray-600 hover:bg-gray-200 shadow-sm z-[9999]"
        >
          {isMyProfile ? '다른 유저 보기' : '내 프로필'}
        </button>
        <div className="w-[22rem] ml-24 -mt-7">
          {paperImage && (
            <div className="w-[12rem] h-[3.125rem] mb-2 -ml-8 translate-y-28">
              <img src={paperImage} alt="paper name" className="w-full" />
            </div>
          )}
          <ProfileImage src={profileData.profileImageUrl} size={101} />
          <div className="w-[12rem] h-[13.438rem] -mt-[9.375rem] -ml-[53px]">
            <img src={RippedProfile} alt="ripped profile" />
          </div>
          <div className="ml-[9.6rem] -mt-[10.625rem]">
            <div className="flex items-center h-8">
              <h4 className="text-xl leading-tight">{profileData.name}</h4>
              <div className="flex gap-1 w-[120px] ml-1">
                {!isMyProfile && (
                  <>
                    <div>
                      <FollowButton
                        isFollowing={false}
                        width="3.4rem"
                        height="1.25rem"
                        fontSize="9px"
                      />
                    </div>
                    <div>
                      <DmButton />
                    </div>
                  </>
                )}
              </div>
            </div>
            <p className="text-gray-600 font-light text-sm italic -mt-1">
              @{profileData.personalId}
            </p>
            <div>
              <div className="w-[8.438rem] bg-[#ffffff1f] px-4 py-1.5 rounded-[999px] shadow-[0px_2px_4px_#00000040] mt-1">
                <span className="text-sm font-light">follower</span>
                <span className="ml-4 font-semibol">427</span>
              </div>
              <div className="w-[8.438rem] bg-[#ffffff1f] px-4 py-1.5 rounded-[999px] shadow-[0px_2px_4px_#00000040] mt-2">
                <span className="text-sm font-light">following</span>
                <span className="ml-2.5">427</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-[22rem] h-[3.2rem] mt-5 bg-[#ffffff4c] rounded-[5px] flex items-center justify-center">
            <p className="font-light text-black tracking-[0] leading-[15px] text-center px-8 text-[12px]">
              {profileData.introduction}
            </p>
          </div>
        </div>
        <div className="w-full object-cover flex justify-center scale-110 mt-2">
          <img src={ProfilePagePaper} alt="profile page paper" />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
