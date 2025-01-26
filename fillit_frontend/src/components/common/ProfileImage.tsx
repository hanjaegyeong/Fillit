interface ProfileImageProps {
  src: string;
  alt?: string;
  size?: number;
}

const ProfileImage = ({
  src,
  alt = 'profile image',
  size = 42,
}: ProfileImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        height: `${size}px`,
        width: `${size}px`,
      }}
      className="rounded-full object-cover"
    />
  );
};

export default ProfileImage;
