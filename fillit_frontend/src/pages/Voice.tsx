import Header from '@/components/common/Header';
import { BubbleBackground } from '../components/decorations/BubbleBackground';
import VoiceBubbleList from '../components/Voice/VoiceBubbleList';
import { micBack, mic } from '../assets/assets';
import VoiceReplyList from '@/components/Voice/VoiceReplyList';
import VoiceManageModal from '@/components/Voice/Modals/VoiceManageModal';
import { useState } from 'react';

const Voice = () => {
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const handleMicClick = () => {
    setIsManageModalOpen(true);
  };

  const handleModalClose = () => {
    setIsManageModalOpen(false);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header left="home" right="notification" />
      <div className="relative flex-1 overflow-hidden">
        <BubbleBackground />
        <VoiceBubbleList />
        <VoiceReplyList />
        <div className="fixed bottom-28 right-4 z-50">
          <button onClick={handleMicClick} className="relative w-16 h-16">
            <div className="absolute inset-0 w-20 h-20 -translate-x-2 -translate-y-2">
              <img src={micBack} alt="mic-back" className="w-full h-full" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <img src={mic} alt="mic" className="w-16 h-16" />
            </div>
          </button>
          <VoiceManageModal
            isOpen={isManageModalOpen}
            onClose={handleModalClose}
          />
        </div>
      </div>
    </div>
  );
};

export default Voice;
