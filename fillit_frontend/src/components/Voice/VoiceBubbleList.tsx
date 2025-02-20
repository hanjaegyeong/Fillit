import { useState } from 'react';
import VoiceBubbleItem from '@/components/Voice/VoiceBubbleItem';
import VoiceListenModal from '@/components/Voice/Modals/VoiceListenModal';
import { Voice } from '@/types/voice';
import { getFolloweeVoiceListen } from '@/api/voice';
import { AnimatePresence } from 'framer-motion';

interface VoiceBubbleListProps {
  voices: Voice[];
  onVoiceRemove: (voiceId: number) => void;
}

const VoiceBubbleList = ({ voices, onVoiceRemove }: VoiceBubbleListProps) => {
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlayClick = (voice: Voice) => {
    console.log('[VoiceBubbleList] 선택된 보이스:', voice);
    setSelectedVoice(voice);
    setIsModalOpen(true);
    getFolloweeVoiceListen(voice.voiceId);
  };

  const handleModalClose = () => {
    if (selectedVoice) {
      // 끝까지 들었거나 답장했을 때만 리스트에서 제거
      onVoiceRemove(selectedVoice.voiceId);
    }
    setIsModalOpen(false);
    setSelectedVoice(null);
    console.log('[VoiceBubbleList] 모달 닫힘.');
  };

  return (
    <div className="z-10 pt-6 min-w-[22rem] px-4 flex flex-col items-center">
      <h4 className="text-lg mb-2">Voice Bubbles</h4>
      <div className="overflow-y-auto w-full max-h-[calc(100dvh-380px)] hide-scrollbar space-y-4">
        <AnimatePresence mode="popLayout">
          {voices.map((voice) => (
            <VoiceBubbleItem
              key={voice.voiceId}
              voice={voice}
              onPlayClick={handlePlayClick}
            />
          ))}
        </AnimatePresence>
      </div>

      <VoiceListenModal
        voiceData={selectedVoice || undefined}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default VoiceBubbleList;
