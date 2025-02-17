import NoProfileImage from '@/assets/images/no-profile-image.png';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ProfileImageModal from '@/components/common/Modal/ProfileImageModal';
import { NoProfile, RippedProfile } from '@/assets/assets';

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
  const defaultImage = NoProfileImage;

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
            src={src || defaultImage}
            alt={alt}
            style={{
              height: `${size}px`,
              width: `${size}px`,
            }}
            className="rounded-full object-cover border-[0.06rem] border-gray-500"
            onError={(e) => {
              e.currentTarget.src = defaultImage;
            }}
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
