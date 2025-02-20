import { useNavigate } from 'react-router-dom';
import { LogoIcon } from '@/assets/assets';

const LogoButton = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <button onClick={handleGoHome}>
      <img src={LogoIcon} alt="logo icon" />
    </button>
  );
};

export default LogoButton;
