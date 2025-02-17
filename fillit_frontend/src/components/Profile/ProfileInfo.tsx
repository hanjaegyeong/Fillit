import ProfileImage from '@/components/common/ProfileImage';
import { NoProfile } from '@/assets/assets';
import { DmButton } from '@/components/common/Button/DmButton';
import FollowButton from '@/components/common/Button/FollowButton';
import { User } from '@/types/user';
import ProfileFollow from './ProfileFollow';
import { useEffect, useState } from 'react';

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
  const [followersCount, setFollowersCount] = useState<number>(
    profileData?.followerCount ?? 0
  );
  const [followingCount, setFollowingCount] = useState<number>(
    profileData?.followeeCount ?? 0
  );
  const [isFollowing, setIsFollowing] = useState<boolean>(
    profileData?.follow ?? false
  );

  // 팔로우 상태 변경 시 팔로워 수 업데이트
  const handleFollowChange = (newFollowState: boolean) => {
    setIsFollowing(newFollowState);
    // 팔로우/언팔로우에 따라 팔로워 수 업데이트
    setFollowersCount((prev) => (newFollowState ? prev + 1 : prev - 1));
  };

  useEffect(() => {
    if (profileData) {
      setFollowersCount(profileData.followerCount ?? 0);
      setFollowingCount(profileData.followeeCount ?? 0);
      setIsFollowing(profileData.follow ?? false);
    }
  }, [profileData]);

  return (
    <div className="max-w-[20rem] ml-8 -mt-7">
      {paperImage && (
        <div className="w-[12rem] h-[3.125rem] mb-2 -ml-10 translate-y-28">
          <img src={paperImage} alt="paper name" className="w-full" />
        </div>
      )}
      <div className="-ml-2">
        <ProfileImage
          src={profileData.profileImageUrl}
          type="profile"
          size={101}
        />
      </div>

      <div className="ml-[9.2rem] -mt-[10.625rem]">
        <div className="flex items-center h-8">
          <h4 className="text-xl leading-tight">{profileData.name}</h4>
          <div className="flex gap-1 ml-1">
            {!isMyProfile && (
              <>
                <FollowButton
                  isFollowing={isFollowing}
                  followeePersonalId={profileData.personalId}
                  onFollowChange={handleFollowChange}
                  width="3.4rem"
                  height="1.25rem"
                  fontSize="9px"
                  userData={{
                    name: profileData.name,
                    profileImageUrl: profileData.profileImageUrl,
                  }}
                />
                <DmButton
                  otherPersonalId={profileData.personalId}
                  otherUserName={profileData.name}
                  otherProfileImageUrl={
                    profileData.profileImageUrl ?? NoProfile
                  }
                />
              </>
            )}
          </div>
        </div>
        <p className="text-gray-600 font-light text-xs italic -mt-1.5">
          @{profileData.personalId}
        </p>
        <ProfileFollow
          followersCount={Number(followersCount)}
          followingCount={Number(followingCount)}
          personalId={profileData.personalId}
        />
      </div>
    </div>
  );
};

export default ProfileInfo;
