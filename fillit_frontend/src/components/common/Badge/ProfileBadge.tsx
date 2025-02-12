import ProfileImage from '@/components/common/ProfileImage';

interface ProfileBadgeProps {
  profileImageUrl?: string | null;
  personalId: string;
  imageSize?: number;
}

const ProfileBadge = ({
  profileImageUrl,
  personalId,
  imageSize = 44,
}: ProfileBadgeProps) => {
  return (
    <div className={`flex items-center ${imageSize < 40 ? 'gap-2' : 'gap-3'}`}>
      <ProfileImage src={profileImageUrl} size={imageSize} />
      <div className="font-medium text-base">{personalId}</div>
    </div>
  );
};

export default ProfileBadge;
