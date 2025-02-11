import { motion } from 'framer-motion';
import { micBig, soundWave } from '@/assets/assets';
import VoiceBaseModal from './VoiceBaseModal';
import VoiceButton from '@/components/common/Button/VoiceButton';
import { useVoiceControl } from '@/hooks/useVoiceControl';
import { postVoice, getVoice } from '@/api/voice';

interface VoiceRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordComplete: (voiceId: number) => void;
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
    handleStop,
    reset,
    recordedFile,
  } = useVoiceControl({
    isModalOpen: isOpen,
    onComplete: () => {
      // 녹음 완료 후 처리
      console.log('[VoiceRecordModal] 녹음 완료됨.');
    },
    recordingMode: true,
  });

  const handleMicClick = () => {
    if (!isRecording && !isRecordingComplete) {
      console.log('[VoiceRecordModal] 녹음 시작됨.');
      handleRecord();
    }
  };

  const handleReRecord = () => {
    reset();
    console.log('[VoiceRecordModal] 녹음 리셋됨.');
  };

  const handleSubmit = async () => {
    if (recordedFile) {
      try {
        await postVoice(recordedFile);
        console.log('[VoiceRecordModal] 음성 업로드 성공.');
        setTimeout(async () => {
          try {
            const myVoice = await getVoice();
            console.log('[VoiceRecordModal] 내 음성 데이터 fetched:', myVoice);
            if (myVoice && myVoice.voiceId) {
              onRecordComplete(myVoice.voiceId);
            } else {
              console.warn('[VoiceRecordModal] 내 음성 데이터 없음.');
              onRecordComplete(0);
            }
          } catch (error) {
            console.error(
              '[VoiceRecordModal] 내 음성 데이터 fetch 실패:',
              error
            );
            onRecordComplete(0);
          }
        }, 2000);
        onClose();
      } catch (error) {
        console.error('[VoiceRecordModal] 음성 업로드 실패:', error);
        onRecordComplete(0);
        onClose();
      }
    }
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
          {!isRecording && !isRecordingComplete ? (
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
          ) : isRecording ? (
            <motion.img
              src={soundWave}
              alt="Sound Wave"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-[120px] h-[160px]"
            />
          ) : (
            <motion.img
              src={micBig}
              alt="Microphone"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-[120px] h-[160px]"
            />
          )}
        </div>

        {/* Sound Wave 또는 버튼들 */}
        <div className="mt-4">
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
      </div>
    </VoiceBaseModal>
  );
};

export default VoiceRecordModal;
