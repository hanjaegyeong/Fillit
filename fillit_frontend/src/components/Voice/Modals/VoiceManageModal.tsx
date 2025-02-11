import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { speaker, pressedSpeaker, caution } from '@/assets/assets';
import VoiceBaseModal from '@/components/Voice/Modals/VoiceBaseModal';
import VoiceButton from '@/components/common/Button/VoiceButton';
import { deleteVoice } from '@/api/voice';
import { useVoiceControl } from '@/hooks/useVoiceControl';

// 보이스 삭제 시 api 함수 deletvoice를 호출

interface VoiceManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteComplete: () => void;
  voiceId: number;
}

const VoiceManageModal = ({
  isOpen,
  onClose,
  onDeleteComplete,
  voiceId,
}: VoiceManageModalProps) => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  // isOpen이 false가 될 때 isDeleteMode 초기화
  useEffect(() => {
    if (!isOpen) {
      setIsDeleteMode(false);
    }
  }, [isOpen]);

  const handleDelete = () => {
    setIsDeleteMode(true);
    console.log('[VoiceManageModal] 삭제 모드 활성화됨.');
  };

  const handleModalClose = () => {
    setIsDeleteMode(false);
    onClose();
    console.log('[VoiceManageModal] 모달 닫힘.');
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteVoice(voiceId);
      onDeleteComplete();
      console.log('[VoiceManageModal] 보이스 삭제 성공.');
    } catch (error) {
      console.error('[VoiceManageModal] 보이스 삭제 실패:', error);
    }
  };

  const recordedVoiceData = localStorage.getItem('recordedVoiceData');
  const { isPlaying, currentDuration, handlePlay } = useVoiceControl({
    isModalOpen: isOpen,
    audioUrl: recordedVoiceData || undefined,
    recordingMode: false, // 재생 모드로 동작
  });

  const handlePlayClick = () => {
    handlePlay();
    console.log('[VoiceManageModal] 보이스 재생 시작됨.');
  };

  return (
    <VoiceBaseModal
      isOpen={isOpen}
      onClose={isDeleteMode ? handleModalClose : onClose}
    >
      <div
        className={`flex flex-col items-center justify-center h-full ${
          isDeleteMode ? 'gap-4' : 'gap-8'
        } mt-12`}
      >
        {!isDeleteMode ? (
          <>
            {/* Duration  - 실제 데이터 사용 시 변경 필요요*/}
            <div className="text-black text-4xl sm:text-5xl md:text-6xl font-medium">
              {Math.floor(currentDuration)}"
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
                className="w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] md:w-[180px] md:h-[180px] cursor-pointer"
                onClick={handlePlayClick}
              />
            </div>

            {/* Delete Button */}
            <div className="mt-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <VoiceButton onClick={handleDelete} text="Delete" />
              </motion.div>
            </div>
          </>
        ) : (
          // 삭제 확인 모드
          <>
            {/* 경고 아이콘 */}
            <motion.img
              src={caution}
              alt="caution"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-[60px] h-[60px]"
            />

            {/* 경고 메시지 */}
            <div className="flex flex-col items-center gap-2">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-xl font-medium"
              >
                Sure you wanna delete this?
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-[#8C8C8C]"
              >
                All replies will be gone
              </motion.p>
            </div>

            {/* 버튼 영역 */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex gap-[85px]">
                <VoiceButton
                  onClick={() => {
                    setIsDeleteMode(false);
                    console.log('[VoiceManageModal] 삭제 취소됨.');
                  }}
                  text="No"
                  color="#D68DE1"
                />
                <VoiceButton onClick={handleDeleteConfirm} text="Yes" />
              </div>
            </motion.div>
          </>
        )}
      </div>
    </VoiceBaseModal>
  );
};

export default VoiceManageModal;
