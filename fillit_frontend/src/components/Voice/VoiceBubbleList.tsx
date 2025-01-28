import { useState } from 'react';
import VoiceBubbleItem from './VoiceBubbleItem';
import VoiceListenModal from './Modals/VoiceListenModal';

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
      <div className="absolute top-[200px] left-1/2 -translate-x-1/2 w-[88%] max-w-[346px]">
        <h4 className="text-xl mb-4 text-center">Voice Bubbles</h4>
        <div className="w-full overflow-y-auto max-h-[calc(100vh-400px)]">
          {items.map((item) => (
            <VoiceBubbleItem
              key={item.personal_id}
              name={item.name}
              personal_id={item.personal_id}
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
