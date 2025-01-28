import { useState } from 'react';
import { motion } from 'framer-motion';
import { micBig, pressedMic, soundWave } from '@/assets/assets';
import VoiceBaseModal from './VoiceBaseModal';
import VoiceButton from '@/components/common/Button/VoiceButton';

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
  const [isRecording, setIsRecording] = useState(false);
  const [isRecordingComplete, setIsRecordingComplete] = useState(false);
  const [duration, setDuration] = useState(0);

  const handleMicClick = () => {
    if (!isRecording && !isRecordingComplete) {
      setIsRecording(true);
      console.log('Recording started...');

      // 임시로 3초 후에 녹음 종료
      setTimeout(() => {
        setIsRecording(false);
        setIsRecordingComplete(true);
        setDuration(29);
        console.log('Recording completed');
      }, 3000);
    }
  };

  const handleReRecord = () => {
    setIsRecordingComplete(false);
    setDuration(0);
  };

  const handleSubmit = () => {
    console.log('Voice submitted');
    onRecordComplete();
    onClose();
  };

  return (
    <VoiceBaseModal isOpen={isOpen} onClose={onClose}>
      {/* Duration */}
      <div className="text-black text-4xl sm:text-5xl md:text-6xl font-medium">
        {duration.toString().padStart(2, '0')}"
      </div>

      {/* 마이크 이미지 */}
      <div className="relative">
        <motion.img
          src={isRecording ? pressedMic : micBig}
          alt="microphone"
          className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] md:w-[220px] md:h-[220px] cursor-pointer"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onClick={handleMicClick}
        />
      </div>

      {/* Sound Wave 또는 버튼들 */}
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
    </VoiceBaseModal>
  );
};

export default VoiceRecordModal;
