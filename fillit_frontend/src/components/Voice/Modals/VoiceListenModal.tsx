import { useState } from 'react';
import { motion } from 'framer-motion';
import { sound, playIcon2, soundWave, profileBubble } from '@/assets/assets';
import VoiceBaseModal from './VoiceBaseModal';
import { useNavigate } from 'react-router-dom';
import VoiceButton from '@/components/common/Button/VoiceButton';

interface VoiceListenModalProps {
  voiceData:
    | {
        name: string;
        personal_id: string;
      }
    | undefined;
  isOpen: boolean;
  onClose: () => void;
}

const VoiceListenModal = ({
  voiceData,
  isOpen,
  onClose,
}: VoiceListenModalProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const navigate = useNavigate();

  if (!voiceData) return null;

  const handleClick = () => {
    if (isFinished) {
      navigate('/voice/reply', {
        state: { voiceData },
      });
    } else {
      setIsPlaying(!isPlaying);
      // 임시로 3초 후에 재생 완료되도록 설정
      setTimeout(() => {
        setIsPlaying(false);
        setIsFinished(true);
      }, 3000);
    }
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
          src={profileBubble}
          alt="profile"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] md:w-[220px] md:h-[220px] rounded-full object-cover"
        />
      </div>

      {/* 재생/답장 버튼 */}
      {isFinished ? (
        <VoiceButton
          onClick={handleClick}
          text="Reply"
          isPlayComplete={isFinished}
        />
      ) : (
        <motion.button
          onClick={handleClick}
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
      )}
    </VoiceBaseModal>
  );
};

export default VoiceListenModal;
