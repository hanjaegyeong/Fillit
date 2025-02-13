import { motion } from 'framer-motion';
import { sound, playIcon2, soundWave, profileBubble } from '@/assets/assets';
import VoiceBaseModal from './VoiceBaseModal';
import VoiceButton from '@/components/common/Button/VoiceButton';
import { useVoiceControl } from '@/hooks/useVoiceControl';
import { Voice } from '@/types/voice';
import { useState } from 'react';
import ReplyRecordModal from './ReplyRecordModal';

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
  const [showReplyModal, setShowReplyModal] = useState(false);
  const { isPlaying, isFinished, currentDuration, handlePlay } =
    useVoiceControl({
      isModalOpen: isOpen,
      audioUrl: voiceData?.audioUrl,
      recordingMode: false, // 재생 모드
    });

  if (!voiceData) return null;

  const handleClick = () => {
    if (isFinished) {
      console.log('[VoiceListenModal] 답장 모달 열기');
      setShowReplyModal(true);
    } else {
      console.log('[VoiceListenModal] 오디오 재생 시작됨.');
      handlePlay();
    }
  };

  return (
    <>
      <VoiceBaseModal isOpen={isOpen} onClose={onClose}>
        <div className="flex flex-col items-center justify-center h-full gap-8 mt-12">
          <div className="text-black text-4xl sm:text-5xl md:text-6xl font-medium">
            {currentDuration}"
          </div>
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

      <ReplyRecordModal
        isOpen={showReplyModal}
        onClose={() => {
          setShowReplyModal(false);
          onClose();
        }}
        voiceData={voiceData}
      />
    </>
  );
};

export default VoiceListenModal;
