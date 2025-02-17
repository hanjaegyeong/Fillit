import BasicButton from '@/components/common/Button/BasicButton';
import Modal from '@/components/common/Modal/Modal';
import InterestTags from '@/components/common/InterestTags';
import { useEffect, useState } from 'react';

interface TagSelectModalProps {
  isOpen: boolean;
  selectedTags?: string[];
  onClose: () => void;
  onConfirm: (tag: string[]) => void;
}

export const TagSelectModal = ({
  isOpen,
  selectedTags = [],
  onClose,
  onConfirm,
}: TagSelectModalProps) => {
  const [localSelectedTags, setLocalSelectedTags] =
    useState<string[]>(selectedTags);

  useEffect(() => {
    if (isOpen) {
      setLocalSelectedTags(selectedTags);
    }
  }, [selectedTags, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="big">
      <div className="m-3">
        <span className="text-2xl pt-4 pb-4 flex justify-center items-center">
          Please select a category
        </span>
        <InterestTags
          selectedTags={localSelectedTags}
          onChange={setLocalSelectedTags}
        />
        <div className="pt-4 flex justify-center items-center">
          <BasicButton
            text="Done"
            width="92px"
            onClick={() => onConfirm(localSelectedTags)}
          />
        </div>
      </div>
    </Modal>
  );
};
