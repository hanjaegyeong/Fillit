import { useState } from 'react';
import { motion } from 'framer-motion';
import { sound, playIcon2, soundWave } from '@/assets/assets';
import VoiceBaseModal from './VoiceBaseModal';

interface VoiceReplyModalProps {
  replyData:
    | {
        id: string;
        user_id: string;
      }
    | undefined;
  isOpen: boolean;
  onClose: () => void;
}

const VoiceReplyModal = ({
  replyData,
  isOpen,
  onClose,
}: VoiceReplyModalProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!replyData) return null;

  const handlePlayClick = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <VoiceBaseModal isOpen={isOpen} onClose={onClose}>
      {/* 재생 시간 */}
      <div className="text-black text-4xl sm:text-5xl md:text-6xl font-medium">
        29"
      </div>

      {/* 프로필 이미지 */}
      <div className="relative">
        <motion.img
          src={soundWave}
          alt="sound wave"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute -bottom-2 w-full h-7"
        />
        <motion.img
          src={`https://i.pravatar.cc/150?u=${replyData.user_id}`}
          alt="profile"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] md:w-[220px] md:h-[220px] rounded-full object-cover"
        />
      </div>

      {/* 재생 버튼 */}
      <motion.button
        onClick={handlePlayClick}
        className="w-[46px] h-[47px]"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <img
          src={isPlaying ? sound : playIcon2}
          alt={isPlaying ? 'sound' : 'play'}
          className="w-full h-full"
        />
      </motion.button>
    </VoiceBaseModal>
  );
};

export default VoiceReplyModal;
