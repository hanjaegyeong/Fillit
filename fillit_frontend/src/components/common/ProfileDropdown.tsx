import { useState } from 'react';
import { DeleteLogoutModal } from './Modal/DeleteLogoutModal';
import { useNavigate } from 'react-router-dom';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDropdown = ({ isOpen, onClose }: ProfileDropdownProps) => {
  const navigate = useNavigate();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleProfileEdit = () => {
    navigate('edit');
  };

  const handleCustomize = () => {
    console.log('프로필 꾸미기');
    onClose();
  };

  // 로그아웃
  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    console.log('로그아웃 확인');
    setIsLogoutModalOpen(false);
    onClose();
    navigate('/login');
  };

  const handleLogoutCancle = () => {
    console.log('로그아웃 취소');
    setIsLogoutModalOpen(false);
    onClose();
  };

  const menuItemClass =
    'w-full text-left px-[1rem] py-[0.5rem] hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white';
  const dangerItemClass = `${menuItemClass} text-red-500`;

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-20" onClick={onClose} />
      <div className="absolute right-[1rem] top-[3.5rem]  w-[7rem] z-30 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700">
        <ul className="py-[0.5rem] text-sm text-gray-700 dark:text-gray-200">
          <li>
            <button onClick={handleProfileEdit} className={menuItemClass}>
              Edit Profile
            </button>
          </li>
          <li>
            <button onClick={handleCustomize} className={menuItemClass}>
              Customize
            </button>
          </li>
          <li>
            <button onClick={handleLogout} className={dangerItemClass}>
              Logout
            </button>
          </li>
        </ul>
      </div>

      <DeleteLogoutModal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancle}
        onConfirm={handleLogoutConfirm}
        message="logout"
      />
    </>
  );
};
