import { useState } from 'react';
import PhotoBorder from '@/assets/images/photo-border.png';
import Camera from '@/assets/images/camera.png';
import ImageCropModal from '@/components/common/Modal/ImageCropModal';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
}

const ImageUpload = ({ onImageUpload }: ImageUploadProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
      setCropModalOpen(true);
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    const file = new File([croppedBlob], 'profile.jpg', {
      type: 'image/jpeg',
    });
    setImage(URL.createObjectURL(file));
    onImageUpload(file);
    setCropModalOpen(false);
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

export default ImageUpload;
