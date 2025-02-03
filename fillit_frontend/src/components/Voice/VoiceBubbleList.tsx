import { useState } from 'react';
import VoiceBubbleItem from '@/components/Voice/VoiceBubbleItem';
import VoiceListenModal from '@/components/Voice/Modals/VoiceListenModal';

interface VoiceBubbleData {
  name: string;
  personal_id: string;
}

const VoiceBubbleList = () => {
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 임시데이터
  const items: VoiceBubbleData[] = [
    { name: 'Alex', personal_id: 'chocolate' },
    { name: 'George', personal_id: 'gowithout' },
    { name: 'Karen', personal_id: 'potato153' },
    { name: 'Alex', personal_id: 'chocolate2' },
    { name: 'Alex', personal_id: 'chocolate3' },
    { name: 'George', personal_id: 'gowithout2' },
    { name: 'Karen', personal_id: 'potato154' },
  ];

  const handlePlayClick = (personal_id: string) => {
    setSelectedVoice(personal_id);
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
          {items.map((item) => (
            <VoiceBubbleItem
              key={item.personal_id}
              {...item}
              onPlayClick={() => handlePlayClick(item.personal_id)}
            />
          ))}
        </div>
      </div>

      <VoiceListenModal
        voiceData={items.find((item) => item.personal_id === selectedVoice)}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </>
  );
};

export default VoiceBubbleList;
