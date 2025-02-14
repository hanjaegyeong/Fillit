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
  const [isLoading, setIsLoading] = useState(false);

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
    onComplete: () => {
      console.log('[ReplyRecordModal] 답장 녹음 완료됨.');
    },
    recordingMode: true,
  });

  const handleMicClick = () => {
    if (!isRecording && !isRecordingComplete) {
      console.log('[ReplyRecordModal] 답장 녹음 시작됨.');
      handleRecord();
    }
  };

  const handleReRecord = () => {
    reset();
    console.log('[ReplyRecordModal] 답장 녹음 리셋됨.');
  };

  const handleSubmit = async () => {
    if (recordedFile) {
      try {
        setIsLoading(true);
        setShowToast(true);
        await postVoiceReply(recordedFile, voiceData.voiceId);
        console.log('[ReplyRecordModal] 답장 업로드 성공.');
      } catch (error) {
        console.error('[ReplyRecordModal] 답장 업로드 실패:', error);
      } finally {
        setShowToast(false);
        setIsLoading(false);
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

          <div className="relative">
            {!isRecording && !isRecordingComplete ? (
              <motion.img
                src={micBig}
                alt="microphone"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-[120px] h-[160px] cursor-pointer"
                onClick={handleMicClick}
              />
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
        message="Just sent the voice bubble, fam! 🫧💬"
        isVisible={showToast && isLoading}
      />
    </>
  );
};

export default ReplyRecordModal;
