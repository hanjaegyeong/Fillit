import { useState } from 'react';
import PhotoBorder from '@/assets/images/photo-border.png';
import Camera from '@/assets/images/camera.png';

const ImageUpload = () => {
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImage(URL.createObjectURL(file)); // 업로드된 이미지 미리보기
    }
  };

  return (
    <div className="flex flex-col items-center">
      <label htmlFor="profile-upload" className="relative cursor-pointer">
        <img src={PhotoBorder} alt="Border" className="absolute w-48 h-48" />
        <div className="w-48 h-48 rounded-full overflow-hidden flex items-center justify-center">
          {image ? (
            <img
              src={image}
              alt="Uploaded"
              className="w-40 h-40 rounded-full object-cover"
            />
          ) : (
            <img
              src={Camera}
              alt="Camera Icon"
              className="w-40 h-40 opacity-50"
            />
          )}
        </div>
      </label>
      {/* 실제 파일 업로드 input (숨김 처리) */}
      <input
        type="file"
        id="profile-upload"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
};

export default ImageUpload;
