import BasicButton from '../Button/BasicButton';
import Modal from './Modal';
import { caution } from '@/assets/assets';

interface DeleteLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: 'delete' | 'logout'; // 삭제 or 로그아웃 메세지
}

export const DeleteLogoutModal = ({
  isOpen,
  onClose,
  onConfirm,
  message = 'delete',
}: DeleteLogoutModalProps) => {
  const confirmMessage = message === 'delete' ? 'delete this' : 'logout';
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="small">
      <div className="flex flex-col h-full pt-[22px]">
        <div className="flex-1 flex flex-col justify-center items-center gap-4">
          <img src={caution} alt="caution" className="w-[60px] h-[60px]" />
          <p className="text-xl font-light text-center">
            Are you sure
            <br />
            you want to {confirmMessage}?
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
