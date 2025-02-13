import NoProfileImage from '@/assets/images/no-profile-image.png';

interface ProfileImageProps {
  src?: string | null;
  alt?: string;
  size?: number;
}

const ProfileImage = ({
  src,
  alt = 'profile image',
  size = 44,
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
      className="rounded-full object-cover border-[0.06rem] border-gray-400"
    />
  );
};

export default ProfileImage;
