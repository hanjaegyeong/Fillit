import { useState } from 'react';
import { motion } from 'framer-motion';
import { speaker, pressedSpeaker } from '@/assets/assets';
import VoiceBaseModal from './VoiceBaseModal';
import VoiceButton from '@/components/common/Button/VoiceButton';

interface VoiceManageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoiceManageModal = ({ isOpen, onClose }: VoiceManageModalProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleDelete = () => {
    // TODO: 삭제 로직 구현
    console.log('Delete voice');
  };

  const handlePlayClick = () => {
    setIsPlaying(true);
    console.log('Playing voice...');

    // 3초 후에 재생 종료
    setTimeout(() => {
      setIsPlaying(false);
      console.log('Voice playback ended');
    }, 3000);
  };

  return (
    <VoiceBaseModal isOpen={isOpen} onClose={onClose}>
      {/* Duration */}
      <div className="text-black text-4xl sm:text-5xl md:text-6xl font-medium">
        29"
      </div>

      {/* 스피커 이미지 */}
      <div className="relative">
        <motion.img
          src={isPlaying ? pressedSpeaker : speaker}
          alt="speaker"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] md:w-[220px] md:h-[220px] cursor-pointer"
          onClick={handlePlayClick}
        />
      </div>

      {/* Delete Button */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <VoiceButton onClick={handleDelete} text="Delete" />
      </motion.div>
    </VoiceBaseModal>
  );
};

export default VoiceManageModal;
