import Modal from '@/components/common/Modal/Modal';
import ProfileImage from '@/components/common/ProfileImage';
import BasicButton from '../Button/BasicButton';

interface UnfollowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
  profileImageUrl: string;
}

const UnfollowModal = ({
  isOpen,
  onClose,
  onConfirm,
  name,
  profileImageUrl,
}: UnfollowModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="small">
      <div className="flex flex-col h-full pt-[35px]">
        <div className="flex-1 flex flex-col items-center gap-4">
          <h4 className="text-xl font-medium text-center ">{name}</h4>
          <ProfileImage size={44} src={profileImageUrl} />
          <p className="text-xl font-light text-center ">
            Are you sure
            <br />
            you want to unfollow?
          </p>
        </div>
        <div className="mt-auto w-full pb-10 flex justify-center items-center gap-12">
          <BasicButton text="No" width="92px" onClick={onClose} />
          <BasicButton text="Yes" width="92px" onClick={onConfirm} />
        </div>
      </div>
    </Modal>
  );
};

export default UnfollowModal;
