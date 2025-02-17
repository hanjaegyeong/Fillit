import { motion } from 'framer-motion';
import { micBig, soundWave } from '@/assets/assets';
import VoiceBaseModal from './VoiceBaseModal';
import VoiceButton from '@/components/common/Button/VoiceButton';
import { useVoiceControl } from '@/hooks/useVoiceControl';
import { postVoiceReply } from '@/api/voice';
import { Voice } from '@/types/voice';
import { useState } from 'react';
import Toast from '@/components/common/Toast/Toast';

interface ReplyRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceData: Voice;
}

const ReplyRecordModal = ({
  isOpen,
  onClose,
  voiceData,
}: ReplyRecordModalProps) => {
  const [showToast, setShowToast] = useState(false);

  const {
    isPlaying: isRecording,
    isFinished: isRecordingComplete,
    currentDuration,
    handleRecord,
    handleStop,
    reset,
    recordedFile,
  } = useVoiceControl({
    isModalOpen: isOpen,
    onComplete: () => {},
    recordingMode: true,
  });

  const handleMicClick = () => {
    if (!isRecording && !isRecordingComplete) {
      handleRecord();
    }
  };

  const handleReRecord = () => {
    reset();
  };

  const handleSubmit = async () => {
    if (recordedFile) {
      try {
        await postVoiceReply(recordedFile, voiceData.voiceId);
        setShowToast(true);
        onClose();

        setTimeout(() => {
          setShowToast(false);
        }, 2000);
      } catch (error) {
        console.error('[ReplyRecordModal] 답장 업로드 실패:', error);
        setShowToast(false);
        onClose();
      }
    }
  };

  return (
    <>
      <VoiceBaseModal isOpen={isOpen} onClose={onClose}>
        <div className="flex flex-col items-center justify-center h-full gap-8 mt-12">
          <div className="text-black text-4xl sm:text-5xl md:text-6xl font-medium">
            {currentDuration}"
          </div>

          <div className="flex flex-col items-center justify-center gap-4">
            {!isRecording && !isRecordingComplete ? (
              <>
                <motion.img
                  src={micBig}
                  alt="microphone"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="w-[120px] h-[160px] sm:w-[120px] sm:h-[160px] md:w-[140px] md:h-[180px] cursor-pointer"
                  onClick={handleMicClick}
                />
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[#4F4A85] text-lg font-medium text-center"
                >
                  Time's ticking, <br /> you got 60 seconds!
                </motion.p>
              </>
            ) : (
              <motion.img
                src={isRecording ? soundWave : micBig}
                alt={isRecording ? 'Sound Wave' : 'Microphone'}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-[120px] h-[160px]"
              />
            )}
          </div>

          {isRecording ? (
            <VoiceButton onClick={handleStop} text="Stop" />
          ) : isRecordingComplete ? (
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
      </VoiceBaseModal>
      <Toast
        message="Voice reply sent successfully! 🎤✨"
        isVisible={showToast}
      />
    </>
  );
};

export default ReplyRecordModal;
