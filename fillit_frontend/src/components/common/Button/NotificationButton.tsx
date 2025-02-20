import { useNavigate } from 'react-router-dom';
import { NotificationOffIcon } from '@/assets/assets';

const NotificationButton = () => {
  const navigate = useNavigate();

  const handleGoNotification = () => {
    navigate('/notification');
  };

  return (
    <button onClick={handleGoNotification}>
      <img src={NotificationOffIcon} alt="notification icon" />
    </button>
  );
};

export default NotificationButton;
