import { useState } from 'react';
import VoiceBubbleItem from '@/components/Voice/VoiceBubbleItem';
import VoiceListenModal from '@/components/Voice/Modals/VoiceListenModal';

interface VoiceBubbleData {
  name: string;
  personalId: string;
}

const VoiceBubbleList = () => {
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 임시데이터
  const items: VoiceBubbleData[] = [
    { name: 'Alex', personalId: 'chocolate' },
    { name: 'George', personalId: 'gowithout' },
    { name: 'Karen', personalId: 'potato153' },
    { name: 'Alex', personalId: 'chocolate2' },
    { name: 'Alex', personalId: 'chocolate3' },
    { name: 'George', personalId: 'gowithout2' },
    { name: 'Karen', personalId: 'potato154' },
  ];

  const handlePlayClick = (personalId: string) => {
    setSelectedVoice(personalId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedVoice(null);
  };

  return (
    <>
      <div className="absolute top-[200px] left-1/2 -translate-x-1/2 w-[88%] max-w-[346px]">
        <h4 className="text-xl mb-4 text-center">Voice Bubbles</h4>
        <div className="w-full overflow-y-auto max-h-[calc(100vh-400px)] hide-scrollbar">
          {items.map((item) => (
            <VoiceBubbleItem
              key={item.personalId}
              {...item}
              onPlayClick={() => handlePlayClick(item.personalId)}
            />
          ))}
        </div>
      </div>

      <VoiceListenModal
        voiceData={items.find((item) => item.personalId === selectedVoice)}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </>
  );
};

export default VoiceBubbleList;
