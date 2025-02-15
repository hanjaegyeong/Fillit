import NoProfileImage from '@/assets/images/no-profile-image.png';

interface ProfileImageProps {
  src?: string | null;
  alt?: string;
  size?: number;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const ProfileImage = ({
  src,
  alt = 'profile image',
  size = 44,
  onClick,
}: ProfileImageProps) => {
  const defaultImage = NoProfileImage;

  return (
    <img
      src={src || defaultImage}
      alt={alt}
      style={{
        height: `${size}px`,
        width: `${size}px`,
      }}
      className="rounded-full object-cover border-[0.06rem] border-gray-500"
      onClick={onClick}
      onError={(e) => {
        e.currentTarget.src = defaultImage;
      }}
    />
  );
};

export default ProfileImage;
