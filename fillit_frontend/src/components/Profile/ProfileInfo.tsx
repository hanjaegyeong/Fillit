import ProfileImage from '@/components/common/ProfileImage';
import { RippedProfile } from '@/assets/assets';
import { DmButton } from '@/components/common/Button/DmButton';
import FollowButton from '@/components/common/Button/FollowButton';
import { User } from '@/types/user';
import ProfileFollow from './ProfileFollow';

interface ProfileInfoProps {
  profileData: User;
  paperImage: string | null;
  isMyProfile: boolean;
}

const ProfileInfo = ({
  profileData,
  paperImage,
  isMyProfile,
}: ProfileInfoProps) => {
  return (
    <div className="w-[22rem] ml-20 -mt-7">
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
                <FollowButton
                  isFollowing={false}
                  width="3.4rem"
                  height="1.25rem"
                  fontSize="9px"
                />
                <DmButton />
              </>
            )}
          </div>
        </div>
        <p className="text-gray-600 font-light text-xs italic -mt-1.5">
          @{profileData.personalId}
        </p>
        <ProfileFollow />
      </div>
    </div>
  );
};

export default ProfileInfo;
