import { useState } from 'react';
import BasicButton from '@/components/common/Button/BasicButton';
import InterestTags from '../InterestTags';
import Modal from '@/components/common/Modal/Modal';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (tags: string[]) => void;
  selectedCategory: string[];
}

export const CategoryModal = ({
  isOpen,
  onClose,
  onSelect,
  selectedCategory,
}: CategoryModalProps) => {
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(selectedCategory);

  const handleConfirm = () => {
    onSelect(selectedCategories);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="big">
      <div className="flex flex-col h-full">
        <h2 className="text-xl font-light text-center pt-12">
          Please select a category
        </h2>
        <div className="flex-1 flex items-center justify-center -mt-11">
          <div className="scale-90">
            <InterestTags
              selectedTags={selectedCategories}
              onChange={setSelectedCategories}
            />
          </div>
        </div>
        <div className="-mt-1 pb-10 flex justify-center gap-4">
          <BasicButton text="Cancel" onClick={onClose} />
          <BasicButton
            text="Confirm"
            textColor="text-[#D68DE1]"
            onClick={handleConfirm}
          />
        </div>
      </div>
    </Modal>
  );
};
