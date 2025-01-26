import { useNavigate } from 'react-router-dom';
import { BackIcon } from '@/assets/assets';

const BackButton = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <button onClick={handleGoBack}>
      <img src={BackIcon} alt="back icon" />
    </button>
  );
};

export default BackButton;
