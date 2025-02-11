{
  /*프로필 이미지 업로드*/
}

import React, { useRef, useCallback } from 'react';
import ProfileImage from '@/components/common/ProfileImage';
import { CameraIcon } from '@/assets/assets';

interface ProfileImageUploaderProps {
  imageUrl: string | null;
  onFileChange: (file: File) => void;
}

const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
  imageUrl,
  onFileChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        onFileChange(file);
      }
    },
    [onFileChange]
  );

  return (
    <div className="mt-16 flex flex-col items-center">
      <ProfileImage src={imageUrl} size={101} />
      <button
        onClick={handleCameraClick}
        className="w-10 h-10 bg-white rounded-[1.3rem] shadow-[5px_6px_18px_#00000014] -mt-8 ml-20"
      >
        <img src={CameraIcon} alt="camera" className="scale-125 ml-2.5" />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
      />
    </div>
  );
};

export default React.memo(ProfileImageUploader);
