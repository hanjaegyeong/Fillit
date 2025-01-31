import { motion } from 'framer-motion';
import { micBig, pressedMic, soundWave } from '@/assets/assets';
import VoiceBaseModal from './VoiceBaseModal';
import VoiceButton from '@/components/common/Button/VoiceButton';
import { useVoiceControl } from '@/hooks/useVoiceControl';

interface VoiceRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordComplete: () => void;
}

const VoiceRecordModal = ({
  isOpen,
  onClose,
  onRecordComplete,
}: VoiceRecordModalProps) => {
  const {
    isPlaying: isRecording,
    isFinished: isRecordingComplete,
    currentDuration,
    handleRecord,
    reset,
  } = useVoiceControl({
    isModalOpen: isOpen,
    onComplete: () => {
      // 녹음 완료 후 처리
    },
  });

  const handleMicClick = () => {
    if (!isRecording && !isRecordingComplete) {
      handleRecord();
    }
  };

  const handleReRecord = () => {
    reset();
  };

  const handleSubmit = () => {
    onRecordComplete();
    onClose();
  };

  return (
    <VoiceBaseModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center h-full gap-8 mt-12">
        {/* Duration */}
        <div className="text-black text-4xl sm:text-5xl md:text-6xl font-medium">
          {currentDuration}"
        </div>

        {/* 마이크 이미지 */}
        <div className="relative">
          <motion.img
            src={isRecording ? pressedMic : micBig}
            alt="microphone"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-[120px] h-[160px] sm:w-[120px] sm:h-[160px] md:w-[140px] md:h-[180px] cursor-pointer"
            onClick={handleMicClick}
          />
        </div>

        {/* Sound Wave 또는 버튼들 */}
        <div className="mt-4">
          {isRecordingComplete ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex gap-[85px]">
                <VoiceButton
                  onClick={handleReRecord}
                  text="Re-Record"
                  color="#D68DE1"
                />
                <VoiceButton onClick={handleSubmit} text="Submit" />
              </div>
            </motion.div>
          ) : (
            <motion.img
              src={soundWave}
              alt="sound wave"
              initial={{ opacity: 0 }}
              animate={{ opacity: isRecording ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-[121px] h-7"
            />
          )}
        </div>
      </div>
    </VoiceBaseModal>
  );
};

export default VoiceRecordModal;
