import { useNavigate, useLocation } from 'react-router-dom';
import { BackIcon } from '@/assets/assets';

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    if (location.state && location.state.fromEdit) {
      navigate('/', { replace: true });
    } else {
      navigate(-1);
    }
  };

  return (
    <button onClick={handleGoBack}>
      <img src={BackIcon} alt="back icon" />
    </button>
  );
};

export default BackButton;
