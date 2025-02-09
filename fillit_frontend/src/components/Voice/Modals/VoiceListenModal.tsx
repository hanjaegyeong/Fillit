import { motion } from 'framer-motion';
import { sound, playIcon2, soundWave, profileBubble } from '@/assets/assets';
import VoiceBaseModal from './VoiceBaseModal';
import { useNavigate } from 'react-router-dom';
import VoiceButton from '@/components/common/Button/VoiceButton';
import { useVoiceControl } from '@/hooks/useVoiceControl';
import { Voice } from '@/types/voice';

// api에서 내려오는 음원 url과 프로필 이미지 사용

interface VoiceListenModalProps {
  voiceData: Voice | undefined;
  isOpen: boolean;
  onClose: () => void;
}

const VoiceListenModal = ({
  voiceData,
  isOpen,
  onClose,
}: VoiceListenModalProps) => {
  const navigate = useNavigate();
  const { isPlaying, isFinished, currentDuration, handlePlay } =
    useVoiceControl({
      isModalOpen: isOpen,
      audioUrl: voiceData?.audioUrl,
    });

  if (!voiceData) return null;

  const handleClick = () => {
    if (isFinished) {
      // 콘솔 추가
      console.log(
        '[VoiceListenModal] 오디오 재생 완료됨, 답장 페이지로 이동합니다.'
      );
      ///
      navigate('/voice/reply', { state: { voiceData } });
    } else {
      console.log('[VoiceListenModal] 오디오 재생 시작됨.');
      handlePlay();
    }
  };

  return (
    <VoiceBaseModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center h-full gap-8 mt-12">
        {/* 재생 시간 */}
        <div className="text-black text-4xl sm:text-5xl md:text-6xl font-medium">
          {currentDuration}"
        </div>

        {/* 프로필 이미지 */}
        <div className="relative">
          <motion.img
            src={soundWave}
            alt="sound wave"
            initial={{ opacity: 0 }}
            animate={{ opacity: isPlaying ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute -bottom-2 w-full h-7"
          />
          <motion.img
            src={voiceData.profileImageUrl || profileBubble}
            alt="profile"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-[190px] h-[190px] rounded-full object-cover"
          />
        </div>

        {/* 재생/답장 버튼 */}
        {isFinished ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <VoiceButton
              onClick={handleClick}
              text="Reply"
              isPlayComplete={isFinished}
            />
          </motion.div>
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
      </div>
    </VoiceBaseModal>
  );
};

export default VoiceListenModal;
