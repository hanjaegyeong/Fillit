import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProfileImageModal from '@/components/common/Modal/ProfileImageModal';
import { NoProfile, RippedProfile } from '@/assets/assets';

// NoProfile 이미지 프리로딩을 위한 전역 상태
let isNoProfilePreloaded = false;

// 프로필 이미지 깜빡임 방지
const preloadNoProfile = () => {
  if (isNoProfilePreloaded) return Promise.resolve();

  return new Promise((resolve) => {
    const img = new Image();
    img.src = NoProfile;
    img.onload = () => {
      isNoProfilePreloaded = true;
      resolve(true);
    };
    img.onerror = () => {
      isNoProfilePreloaded = true;
      resolve(false);
    };
  });
};

interface ProfileImageProps {
  src?: string | null;
  alt?: string;
  size?: number;
  personalId?: string;
  type?: 'profile' | 'default';
}

const ProfileImage = ({
  src,
  alt = 'profile image',
  size = 44,
  personalId,
  type = 'default',
}: ProfileImageProps) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(NoProfile);

  useEffect(() => {
    const loadImages = async () => {
      await preloadNoProfile();

      if (src) {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          setImageSrc(src);
        };
        img.onerror = () => {
          setImageSrc(NoProfile);
        };
      } else {
        setImageSrc(NoProfile);
      }
    };

    loadImages();
  }, [src]);

  const handleClickProfileImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (type === 'profile') {
      setIsModalOpen(true);
    } else if (personalId) {
      navigate(`/profile/${personalId}`);
    }
  };

  return (
    <>
      <div>
        <button onClick={handleClickProfileImage}>
          <img
            src={imageSrc}
            alt={alt}
            style={{
              height: `${size}px`,
              width: `${size}px`,
            }}
            className="rounded-full object-cover border-[0.06rem] border-gray-500"
            onError={() => setImageSrc(NoProfile)}
            loading="eager"
            decoding="async"
          />
        </button>
        {type === 'profile' && (
          <img
            src={RippedProfile}
            alt="ripped profile"
            className="top-0 left-0 w-[12rem] h-[13.438rem] -mt-[10rem] -ml-[3.23rem] pointer-events-none"
          />
        )}
      </div>
      <ProfileImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={src || NoProfile}
      />
    </>
  );
};

export default ProfileImage;
