import BasicButton from '../Button/BasicButton';
import Modal from './Modal';
import InterestTags from '../InterestTags';

interface TagSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const TagSelectModal = ({ isOpen, onClose }: TagSelectModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="big">
      <div className="m-3">
        <span className="text-2xl pt-4 pb-4 flex justify-center items-center">
          Please select a category
        </span>
        <InterestTags />
        <div className="pt-4 flex justify-center items-center">
          <BasicButton text="Done" width="92px" onClick={onClose} />
        </div>
      </div>
    </Modal>
  );
};
