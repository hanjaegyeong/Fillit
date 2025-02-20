import { useNavigate } from 'react-router-dom';
import { NotificationOnIcon } from '@/assets/assets';

const NotificationButton = () => {
  const navigate = useNavigate();

  const handleGoNotification = () => {
    navigate('/notification');
  };

  return (
    <button onClick={handleGoNotification}>
      <img src={NotificationOnIcon} alt="notification icon" />
    </button>
  );
};

export default NotificationButton;
