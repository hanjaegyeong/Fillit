import NoProfileImage from '@/assets/images/no-profile-image.png';
import { useNavigate } from 'react-router-dom';

interface ProfileImageProps {
  src?: string | null;
  alt?: string;
  size?: number;
  personalId?: string;
}

const ProfileImage = ({
  src,
  alt = 'profile image',
  size = 44,
  personalId,
}: ProfileImageProps) => {
  const navigate = useNavigate();

  const defaultImage = NoProfileImage;

  const handleClickProfileImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (personalId) navigate(`/profile/${personalId}`);
  };

  return (
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
  );
};

export default ProfileImage;
