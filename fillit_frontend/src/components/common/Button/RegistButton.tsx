import { RegistIcon } from '@/assets/assets';

interface RegistButtonProps {
  onClick?: () => void;
}

const RegistButton = ({ onClick }: RegistButtonProps) => {
  return (
    <button onClick={onClick}>
      <img src={RegistIcon} alt="regist icon" />
    </button>
  );
};

export default RegistButton;
