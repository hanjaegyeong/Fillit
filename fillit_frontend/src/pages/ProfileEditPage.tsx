import React, { useCallback } from 'react';
import Header from '@/components/common/Header/Header';
import BasicButton from '@/components/common/Button/BasicButton';
import ProfileImageUploader from '@/components/Profile/ProfileImageUploader';
import ProfileEditForm from '@/components/Profile/ProfileEditForm';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import LoadingSpinner from '@/components/common/Loading/LoadingSpinner';

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const {
    profile,
    setProfile,
    setProfileImageFile,
    updateProfile,
    currentUser,
    isLoading,
  } = useProfile();

  // 이미지 변경시 URL 생성
  const handleFileChange = useCallback(
    (file: File) => {
      setProfileImageFile(file);
      // 브라우저 메모리 상에서 보여주기 위한 URL 생성
      const imageUrl = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, profileImageUrl: imageUrl }));
    },
    [setProfile, setProfileImageFile]
  );

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setProfile((prev) => ({ ...prev, name: value }));
    },
    [setProfile]
  );

  const handleIntroductionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setProfile((prev) => ({ ...prev, introduction: value }));
    },
    [setProfile]
  );

  const handleEditClick = useCallback(async () => {
    try {
      await updateProfile();
      navigate(`/profile/${currentUser.personalId}`);
    } catch (error) {
      console.error('프로필 수정 실패:', error);
    }
  }, [updateProfile, navigate, currentUser.personalId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container-header">
      <Header left="back" />
      <div className="flex flex-col items-center">
        <ProfileImageUploader
          imageUrl={profile.profileImageUrl}
          onFileChange={handleFileChange}
        />
        <ProfileEditForm
          name={profile.name}
          introduction={profile.introduction}
          onNameChange={handleNameChange}
          onIntroductionChange={handleIntroductionChange}
        />
        <div className="mt-10">
          <BasicButton text="Edit" onClick={handleEditClick} width="6rem" />
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;
