import { useState } from 'react';
import { DeleteLogoutModal } from './Modal/DeleteLogoutModal';
import { useNavigate } from 'react-router-dom';

interface ArticleDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const ArticleDropdown = ({ isOpen, onClose }: ArticleDropdownProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleArticleEdit = () => {
    console.log('게시글 수정');
    onClose();
  };

  // 게시글 삭제
  const handleDeleteArticle = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    console.log('게시글 삭제 확인');
    setIsDeleteModalOpen(false);
    onClose();
  };

  const handleDeleteCancle = () => {
    console.log('게시글 삭제 취소');
    setIsDeleteModalOpen(false);
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
          <>
            <li>
              <button
                onClick={() => {
                  navigate('/newarticle');
                  handleArticleEdit;
                }}
                className={menuItemClass}
              >
                Edit Post
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  navigate('/');
                  handleArticleEdit;
                }}
                className={dangerItemClass}
              >
                Delete
              </button>
            </li>
          </>
        </ul>
      </div>

      <DeleteLogoutModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancle}
        onConfirm={handleDeleteConfirm}
        message="delete"
      />
    </>
  );
};

export default ArticleDropdown;
