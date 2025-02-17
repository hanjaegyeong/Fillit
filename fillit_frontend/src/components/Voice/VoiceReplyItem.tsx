import { motion, AnimatePresence } from 'framer-motion';
import { VoiceReply } from '@/types/voice';
import { NoProfile } from '@/assets/assets';

interface VoiceReplyItemProps {
  data: VoiceReply;
  onReplyClick: (voiceReply: VoiceReply) => void;
}

const VoiceReplyItem = ({ data, onReplyClick }: VoiceReplyItemProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{
          scale: [1, 1.2, 0],
          opacity: [1, 1, 0],
          rotate: [0, 5, -5],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1],
          exit: {
            duration: 0.4,
            times: [0, 0.6, 1],
          },
        }}
        onClick={() => onReplyClick(data)}
        className="cursor-pointer flex flex-col items-center"
      >
        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
          <img
            src={data.profileImageUrl || NoProfile}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VoiceReplyItem;
