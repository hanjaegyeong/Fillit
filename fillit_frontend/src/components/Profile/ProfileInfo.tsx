import ProfileImage from '@/components/common/ProfileImage';
import { RippedProfile } from '@/assets/assets';
import { DmButton } from '@/components/common/Button/DmButton';
import FollowButton from '@/components/common/Button/FollowButton';
import { User } from '@/types/user';
import ProfileFollow from './ProfileFollow';
import { useCallback, useEffect, useState } from 'react';
import { getFolloweeList, getFollowerList } from '@/api/follow';

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
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState<boolean>(
    profileData.follow ?? false
  );

  // 팔로워 수 및 팔로잉 수 업데이트 함수
  // useCallback으로 메모이제이션
  const updateFollowStats = useCallback(async () => {
    try {
      const followerList = await getFollowerList(profileData.personalId);
      const followeeList = await getFolloweeList(profileData.personalId);

      setFollowersCount(followerList.length);
      setFollowingCount(followeeList.length);
    } catch (error) {
      console.error('팔로우 통계 가져오기 실패:', error);
      // 에러 발생 시에도 null 상태 유지
      setFollowersCount(0);
      setFollowingCount(0);
    }
  }, [profileData.personalId]);

  // 팔로우 상태 변경 시 팔로워 수와 팔로잉 수 업데이트
  const handleFollowChange = (newFollowState: boolean) => {
    setIsFollowing(newFollowState);
    updateFollowStats();
  };

  useEffect(() => {
    updateFollowStats();
    setIsFollowing(profileData.follow ?? false);
  }, [updateFollowStats, profileData.follow]);

  return (
    <div className="w-[22rem] ml-20 -mt-7">
      {paperImage && (
        <div className="w-[12rem] h-[3.125rem] mb-2 -ml-8 translate-y-28">
          <img src={paperImage} alt="paper name" className="w-full" />
        </div>
      )}
      <ProfileImage src={profileData.profileImageUrl} size={101} />
      <div className="w-[12rem] h-[13.438rem] -mt-[9.57rem] -ml-[3.25rem]">
        <img src={RippedProfile} alt="ripped profile" />
      </div>
      <div className="ml-[9.6rem] -mt-[10.625rem]">
        <div className="flex items-center h-8">
          <h4 className="text-xl leading-tight">{profileData.name}</h4>
          <div className="flex gap-1 w-[120px] ml-1">
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
                <DmButton />
              </>
            )}
          </div>
        </div>
        <p className="text-gray-600 font-light text-xs italic -mt-1.5">
          @{profileData.personalId}
        </p>
        <ProfileFollow
          followersCount={followersCount}
          followingCount={followingCount}
          personalId={profileData.personalId}
        />
      </div>
    </div>
  );
};

export default ProfileInfo;
