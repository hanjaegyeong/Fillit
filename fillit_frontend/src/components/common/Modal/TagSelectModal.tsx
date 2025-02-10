import BasicButton from '@/components/common/Button/BasicButton';
import Modal from '@/components/common/Modal/Modal';
import InterestTags from '@/components/common/InterestTags';

interface TagSelectModalProps {
  isOpen: boolean;
  selectedTags?: string[];
  onClose: () => void;
  onConfirm: () => void;
}

export const TagSelectModal = ({
  isOpen,
  selectedTags = [],
  onClose,
}: TagSelectModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="big">
      <div className="m-3">
        <span className="text-2xl pt-4 pb-4 flex justify-center items-center">
          Please select a category
        </span>
        <InterestTags selectedTags={selectedTags} onChange={() => {}} />
        <div className="pt-4 flex justify-center items-center">
          <BasicButton text="Done" width="92px" onClick={onClose} />
        </div>
      </div>
    </Modal>
  );
};
