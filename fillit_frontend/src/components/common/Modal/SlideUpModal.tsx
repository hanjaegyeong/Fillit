import { useEffect } from 'react';

interface SlideUpModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: string;
}

const SlideUpModal = ({
  open,
  onClose,
  children,
  height = 'h-[90dvh]',
}: SlideUpModalProps) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          open ? 'opacity-100 visible z-50' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed bottom-0 left-0 w-full bg-white rounded-t-[2rem] shadow-lg transition-transform duration-300 ${
          open ? 'translate-y-0 z-50' : 'translate-y-full'
        } overflow-y-auto ${height}`}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">AI Fil</h2>
          <button
            className="absolute top-4 right-5 text-gray-500 text-lg"
            onClick={onClose}
          >
            ✕
          </button>
          {children}
        </div>
      </div>
    </>
  );
};

export default SlideUpModal;
