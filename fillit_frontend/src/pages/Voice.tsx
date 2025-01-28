import Header from '@/components/common/Header';
import { BubbleBackground } from '../components/decorations/BubbleBackground';
import VoiceBubbleList from '../components/Voice/VoiceBubbleList';
import { micBack, mic } from '../assets/assets';
import VoiceReplyList from '@/components/Voice/VoiceReplyList';
import VoiceManageModal from '@/components/Voice/Modals/VoiceManageModal';
import VoiceRecordModal from '@/components/Voice/Modals/VoiceRecordModal';
import { useState } from 'react';

const Voice = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasRecordedVoice, setHasRecordedVoice] = useState(false);

  const handleMicClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleRecordComplete = () => {
    setHasRecordedVoice(true);
    setIsModalOpen(false);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header left="home" right="notification" />
      <div className="relative flex-1 overflow-hidden">
        <BubbleBackground />
        <VoiceBubbleList />
        <VoiceReplyList />
        <div className="fixed bottom-28 right-4 z-50">
          <button
            onClick={handleMicClick}
            className="relative w-[72px] h-[72px]"
          >
            <div className="absolute inset-0 w-[88px] h-[88px] -translate-x-2 -translate-y-2">
              <img
                src={micBack}
                alt="mic-back"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={mic}
                alt="mic"
                className="w-[72px] h-[72px] object-contain"
              />
            </div>
          </button>
          {hasRecordedVoice ? (
            <VoiceManageModal isOpen={isModalOpen} onClose={handleModalClose} />
          ) : (
            <VoiceRecordModal
              isOpen={isModalOpen}
              onClose={handleModalClose}
              onRecordComplete={handleRecordComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Voice;
