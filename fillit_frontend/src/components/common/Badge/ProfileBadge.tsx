import ProfileImage from '@/components/common/ProfileImage';

interface ProfileBadgeProps {
  profileImageUrl?: string | null;
  personalId: string;
}

const ProfileBadge = ({ profileImageUrl, personalId }: ProfileBadgeProps) => {
  return (
    <div className="flex items-center gap-2">
      <ProfileImage src={profileImageUrl} />
      <div className="font-medium text-sm">{personalId}</div>
    </div>
  );
};

export default ProfileBadge;
