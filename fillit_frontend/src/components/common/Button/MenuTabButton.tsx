import { MenuTabIcon } from '@/assets/assets';

interface MenuTabButtonProps {
  onClick?: () => void;
}

const MenuTabButton = ({ onClick }: MenuTabButtonProps) => {
  return (
    <button onClick={onClick}>
      <img src={MenuTabIcon} alt="menutab icon" />
    </button>
  );
};

export default MenuTabButton;
