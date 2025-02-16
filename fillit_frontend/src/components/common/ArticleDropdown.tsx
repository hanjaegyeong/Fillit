import { useState } from 'react';
import { DeleteLogoutModal } from './Modal/DeleteLogoutModal';
import { useNavigate } from 'react-router-dom';
import { deleteArticle } from '@/api/article';

interface ArticleDropdownProps {
  boardId: number;
  isOpen: boolean;
  onClose: () => void;
}

const ArticleDropdown = ({
  boardId,
  isOpen,
  onClose,
}: ArticleDropdownProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleArticleEdit = () => {
    navigate('/newarticle');
    onClose();
  };

  // 게시글 삭제
  const handleDeleteArticle = () => {
    deleteArticle(boardId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    console.log('게시글 삭제 확인');
    setIsDeleteModalOpen(false);
    onClose();
    navigate('/');
  };

  const handleDeleteCancle = () => {
    console.log('게시글 삭제 취소');
    setIsDeleteModalOpen(false);
    onClose();
  };

  const menuItemClass =
    'w-full text-left px-3 py-[0.5rem] hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white';
  const dangerItemClass = `${menuItemClass} text-red-500`;

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-20" onClick={onClose} />
      <div className="w-full max-w-[600px] flex justify-end px-4 fixed top-[3rem] z-30">
        <div className="w-[6.3rem] bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 border border-black">
          <ul className="py-[0.4rem] text-sm text-gray-700 dark:text-gray-200">
            <li>
              <button onClick={handleArticleEdit} className={menuItemClass}>
                Edit
              </button>
            </li>
            <li>
              <button onClick={handleDeleteArticle} className={dangerItemClass}>
                Delete
              </button>
            </li>
          </ul>
        </div>
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
