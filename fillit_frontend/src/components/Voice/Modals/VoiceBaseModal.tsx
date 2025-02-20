import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { bubble4 } from '@/assets/assets';
import ReactDOM from 'react-dom';

interface BaseModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const VoiceBaseModal = ({ children, isOpen, onClose }: BaseModalProps) => {
  const [isVisibleState, setIsVisibleState] = useState(true);
  const modalRoot = document.getElementById('modal-root');

  useEffect(() => {
    if (isOpen) {
      setIsVisibleState(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisibleState(false);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isVisibleState && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-[100]"
          onClick={handleClose}
        >
          <div className="relative w-full max-w-[400px] min-w-[350px] h-screen flex items-center justify-center">
            {/* 배경 버블 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 100 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute bottom-[-10%] -translate-x-1/2 w-[160%]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={bubble4}
                alt="bubble background"
                className="w-full h-auto object-contain "
              />
            </motion.div>

            {/* 컨텐츠 영역 */}
            <motion.div
              className="fixed bottom-[200px] flex flex-col items-center z-10"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: '60%', scale: 0.9, opacity: 0 }}
              animate={{ y: '40%', scale: 1, opacity: 1 }}
              exit={{ y: '60%', scale: 0.9, opacity: 0 }}
              transition={{
                duration: 0.4,
                ease: 'easeOut',
              }}
            >
              {children}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    modalRoot
  );
};

export default VoiceBaseModal;
