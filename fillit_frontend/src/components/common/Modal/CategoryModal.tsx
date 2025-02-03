import { useState } from 'react';
import BasicButton from '@/components/common/Button/BasicButton';
import InterestTags from '../InterestTags';
import Modal from '@/components/common/Modal/Modal';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (tag: string) => void;
}

export const CategoryModal = ({
  isOpen,
  onClose,
  onSelect,
}: CategoryModalProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  //   const handleCategorySelect = (tag: string) => {
  //     setSelectedCategory(tag);
  //   };

  const handleConfirm = () => {
    if (selectedCategory) {
      onSelect(selectedCategory);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedCategory('');
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="big">
      <div className="flex flex-col h-full">
        <h2 className="text-xl font-light text-center pt-12">
          Please select a category
        </h2>
        <div className="flex-1 flex items-center justify-center -mt-11">
          <div className="scale-90">
            <InterestTags />
          </div>
        </div>
        <div className="-mt-1 pb-10 flex justify-center gap-4">
          <BasicButton text="Cancel" onClick={handleClose} />
          <BasicButton
            text="Confirm"
            onClick={handleConfirm}
            disabled={!selectedCategory}
          />
        </div>
      </div>
    </Modal>
  );
};
