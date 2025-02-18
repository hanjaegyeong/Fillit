import { useState, useEffect, useCallback } from 'react';
import { getUserInfo, getUserProfile, patchUserProfile } from '@/api/user';
import { UserUpdateForm } from '@/types/user';
import { useUserStore } from '@/store/useUserStore';

export const useProfile = () => {
  const { user: currentUser, setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: currentUser.name || '',
    introduction: currentUser.introduction || '',
    profileImageUrl: currentUser.profileImageUrl || null,
  });
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        if (currentUser.personalId) {
          const data = await getUserProfile(currentUser.personalId);
          setProfile({
            name: data.name,
            introduction: data.introduction,
            profileImageUrl: data.profileImageUrl,
          });
        }
      } catch (error) {
        console.error('프로필 데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [currentUser.personalId]);

  const updateProfile = useCallback(async () => {
    try {
      const updateForm: UserUpdateForm = {
        update: {
          name: profile.name,
          introduction: profile.introduction,
        },
      };
      if (profileImageFile) {
        updateForm.profileImage = profileImageFile;
      }

      await patchUserProfile(updateForm);

      const response = await getUserInfo();
      setUser(response);
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      throw error;
    }
  }, [profile, profileImageFile, setUser]);

  return {
    profile,
    setProfile,
    profileImageFile,
    setProfileImageFile,
    updateProfile,
    currentUser,
    isLoading,
  };
};
