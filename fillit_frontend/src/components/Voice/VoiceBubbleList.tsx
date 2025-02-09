import { useState } from 'react';
import VoiceBubbleItem from '@/components/Voice/VoiceBubbleItem';
import VoiceListenModal from '@/components/Voice/Modals/VoiceListenModal';
import { Voice } from '@/types/voice';

interface VoiceBubbleListProps {
  voices: Voice[];
}

const VoiceBubbleList = ({ voices }: VoiceBubbleListProps) => {
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 임시데이터
  // const items: VoiceBubbleData[] = [
  //   { name: 'Alex', personalId: 'chocolate' },
  //   { name: 'George', personalId: 'gowithout' },
  //   { name: 'Karen', personalId: 'potato153' },
  //   { name: 'Alex', personalId: 'chocolate2' },
  //   { name: 'Alex', personalId: 'chocolate3' },
  //   { name: 'George', personalId: 'gowithout2' },
  //   { name: 'Karen', personalId: 'potato154' },
  // ];

  const handlePlayClick = (voice: Voice) => {
    setSelectedVoice(voice);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedVoice(null);
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
