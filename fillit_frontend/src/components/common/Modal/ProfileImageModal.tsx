import { motion, AnimatePresence } from 'framer-motion';

interface ProfileImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

const ProfileImageModal = ({
  isOpen,
  onClose,
  imageUrl,
}: ProfileImageModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="relative w-64 h-64 rounded-full overflow-hidden"
          >
            <img
              src={imageUrl}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileImageModal;
