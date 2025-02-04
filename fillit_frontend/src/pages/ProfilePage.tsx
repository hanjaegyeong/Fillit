import Header from '@/components/common/Header/Header';
import ProfileImage from '@/components/common/ProfileImage';
import { RippedProfile } from '@/assets/assets';
import { user } from '@/mocks/fixtures/user';
import { useEffect, useState } from 'react';
import { getPaperText } from '@/utils/getPaperText';

const ProfilePage = () => {
  const [paperImage, setPaperImage] = useState<string | null>(null);

  useEffect(() => {
    const loadPaperText = async () => {
      const image = await getPaperText(user.name, 192);
      setPaperImage(image);
    };
    loadPaperText();
  }, []);

  return (
    <div className="container-header-nav">
      <Header left="home" right="menu" />
      <div className="w-full">
        <div className="ml-20 -mt-5">
          {paperImage && (
            <div className="w-[192px] h-[50px] mb-2 -ml-8 translate-y-28">
              <img src={paperImage} alt="paper name" className="w-full" />
            </div>
          )}
          <ProfileImage src={user.profileImageUrl} size={101} />
          <div className="w-[192px] h-[215px] -mt-[150px] -ml-[53px]">
            <img src={RippedProfile} alt="ripped profile" />
          </div>
          <div className="ml-[145px] -mt-[170px]">
            <h2 className="text-2xl leading-tight">{user.name}</h2>
            <p className="text-gray-600 font-light text-sm italic -mt-1">
              @{user.personalId}
            </p>
            <div>
              <div className="w-[135px] bg-[#ffffff1f] px-4 py-1.5 rounded-[999px] shadow-[0px_2px_4px_#00000040] mt-1">
                <span className="text-sm font-light">follower</span>
                <span className="ml-4 font-semibol">427</span>
              </div>
              <div className="w-[135px] bg-[#ffffff1f] px-4 py-1.5 rounded-[999px] shadow-[0px_2px_4px_#00000040] mt-2">
                <span className="text-sm font-light">following</span>
                <span className="ml-2.5">427</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-[351px] h-[51px] mt-7 bg-[#ffffff4c] rounded-[5px] flex items-center justify-center">
            <p className="font-light text-black text-[13px] tracking-[0] leading-[15px] text-center px-8 text-[12px]">
              {user.introduction}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
