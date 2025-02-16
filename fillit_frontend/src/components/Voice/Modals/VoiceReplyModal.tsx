import { motion } from 'framer-motion';
import { sound, playIcon2, soundWave, NoProfile } from '@/assets/assets';
import VoiceBaseModal from '@/components/Voice/Modals/VoiceBaseModal';
import { useVoiceControl } from '@/hooks/useVoiceControl';
import { VoiceReply } from '@/types/voice';

interface VoiceReplyModalProps {
  replyData: VoiceReply | undefined;
  isOpen: boolean;
  onClose: () => void;
}

const VoiceReplyModal = ({
  replyData,
  isOpen,
  onClose,
}: VoiceReplyModalProps) => {
  const { isPlaying, currentDuration, handlePlay, isFinished } =
    useVoiceControl({
      isModalOpen: isOpen,
      audioUrl: replyData?.audioUrl,
    });

  const handleClose = () => {
    // 음성을 끝까지 들었을 때만 삭제
    if (isFinished) {
      onClose();
    }
  };

  if (!replyData) return null;

  return (
    <VoiceBaseModal isOpen={isOpen} onClose={handleClose}>
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
            src={replyData.profileImageUrl ?? NoProfile}
            alt="profile"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-[190px] h-[190px] rounded-full object-cover"
          />
        </div>

        {/* 재생 버튼 */}
        <motion.button
          onClick={handlePlay}
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
      </div>
    </VoiceBaseModal>
  );
};

export default VoiceReplyModal;
