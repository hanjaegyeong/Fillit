interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: 'small' | 'big';
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, size = 'small', children }: ModalProps) => {
  if (!isOpen) return null;
  const sizeClass =
    size === 'small' ? 'w-[319px] h-[307px]' : 'w-[319px] h-[529px]';

  return (
    <div>
      <div
        role="presentation"
        className="fixed inset-0 z-50 h-full w-full bg-black bg-opacity-20"
        onClick={onClose}
        aria-label="modal background"
      />
      <section
        role="dialog"
        aria-modal="true"
        className={`fixed left-1/2 top-1/2 bg-white rounded-[20px] z-50 shadow-[0px_2px_4px_#00000040] -translate-x-1/2 -translate-y-1/2 ${sizeClass}`}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {children}
      </section>
    </div>
  );
};
export default Modal;
