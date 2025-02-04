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
    <div className="flex items-center gap-2">
      <ProfileImage src={profileImageUrl} size={imageSize} />
      <div className="font-medium text-sm">{personalId}</div>
    </div>
  );
};

export default ProfileBadge;
