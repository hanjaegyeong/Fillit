{
  /*프로필 이미지 업로드*/
}

import React, { useRef, useCallback, useState } from 'react';
import ProfileImage from '@/components/common/ProfileImage';
import { CameraIcon } from '@/assets/assets';
import ImageCropModal from '@/components/common/Modal/ImageCropModal';

interface ProfileImageUploaderProps {
  imageUrl: string | null;
  onFileChange: (file: File) => void;
}

const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
  imageUrl,
  onFileChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleCameraClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setSelectedImage(URL.createObjectURL(file));
        setCropModalOpen(true);
      }
    },
    []
  );

  const handleCropComplete = useCallback(
    (croppedBlob: Blob) => {
      const file = new File([croppedBlob], 'profile.jpg', {
        type: 'image/jpeg',
      });
      onFileChange(file);
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
        onChange={handleImageSelect}
      />
      {cropModalOpen && selectedImage && (
        <ImageCropModal
          isOpen={cropModalOpen}
          imageUrl={selectedImage}
          onClose={() => setCropModalOpen(false)}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
};

export default React.memo(ProfileImageUploader);
