import { useState } from 'react';
import VoiceBubbleItem from '@/components/Voice/VoiceBubbleItem';
import VoiceListenModal from '@/components/Voice/Modals/VoiceListenModal';
import { Voice } from '@/types/voice';

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
  };

  const handleModalClose = () => {
    if (selectedVoice) {
      onVoiceRemove(selectedVoice.voiceId);
    }
    setIsModalOpen(false);
    setSelectedVoice(null);
    console.log('[VoiceBubbleList] 모달 닫힘.');
  };

  return (
    <>
      <div className="z-10 pt-6">
        <h4 className="text-lg mb-2">Voice Bubbles</h4>
        <div className="w-[340px] overflow-y-auto max-h-[calc(100vh-380px)] hide-scrollbar space-y-4">
          {voices.map((voice) => (
            <VoiceBubbleItem
              key={voice.voiceId}
              voice={voice}
              onPlayClick={handlePlayClick}
            />
          ))}
        </div>
      </div>

      <VoiceListenModal
        voiceData={selectedVoice || undefined}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </>
  );
};

export default VoiceBubbleList;
