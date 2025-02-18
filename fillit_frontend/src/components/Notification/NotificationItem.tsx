import { NOTIFICATION_CONFIG } from '@/constants/notificationConfig';
import { Notification } from '@/types/notification';
import { useNavigate } from 'react-router-dom';
import ProfileImage from '@/components/common/ProfileImage';
import { postNotification } from '@/api/notification';

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem = ({ notification }: NotificationItemProps) => {
  const navigate = useNavigate();
  const {
    notificationId,
    type,
    referenceId,
    senderProfileImageUrl,
    receiverPersonalId,
  } = notification;

  const handleClick = async () => {
    await postNotification(notificationId);
    navigate(NOTIFICATION_CONFIG[type].url(referenceId));
  };

  return (
    <div onClick={handleClick}>
      <ProfileImage
        size={40}
        src={senderProfileImageUrl}
        alt="sender-profile-image"
      />
      <div className="flex">
        <p>{receiverPersonalId}</p>
        <p>{NOTIFICATION_CONFIG[type].message}</p>
      </div>
    </div>
  );
};

export default NotificationItem;
