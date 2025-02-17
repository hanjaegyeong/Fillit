import { useState } from 'react';
import { DeleteLogoutModal } from '@/components/common/Modal/DeleteLogoutModal';
import { useNavigate } from 'react-router-dom';
import { getLogout } from '@/api/login';
import { useUserStore } from '@/store/useUserStore';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDropdown = ({ isOpen, onClose }: ProfileDropdownProps) => {
  const navigate = useNavigate();
  const { reset } = useUserStore();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleProfileEdit = () => {
    navigate('/edit');
  };

  const handleCustomize = () => {
    console.log('프로필 꾸미기');
    onClose();
    navigate('/customize');
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    console.log('로그아웃 확인');

    await getLogout();
    reset();

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
    'w-full text-left px-3 py-[0.5rem] hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white';
  const dangerItemClass = `${menuItemClass} text-red-500`;

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed w-full flex justify-end inset-0 z-20"
        onClick={onClose}
      />
      <div className="w-full max-w-[600px] flex justify-end px-4 fixed top-[3rem] z-30">
        <div className="w-[6.3rem] bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 border border-black">
          <ul className="py-[0.4rem] text-sm text-gray-700 dark:text-gray-200">
            <li>
              <button onClick={handleProfileEdit} className={menuItemClass}>
                Edit
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
