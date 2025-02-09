import Header from '@/components/common/Header/Header';
import { BubbleBackground } from '@/components/decorations/BubbleBackground';
import VoiceBubbleList from '@/components/Voice/VoiceBubbleList';
import { micBack, mic } from '@/assets/assets';
import VoiceReplyList from '@/components/Voice/VoiceReplyList';
import VoiceManageModal from '@/components/Voice/Modals/VoiceManageModal';
import VoiceRecordModal from '@/components/Voice/Modals/VoiceRecordModal';
import { useState, useEffect } from 'react';
import { getFolloweeVoiceList, getVoiceReplyList } from '@/api/voice';
import { Voice, VoiceReply } from '@/types/voice';

const VoicePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasRecordedVoice, setHasRecordedVoice] = useState(false);
  const [voiceList, setVoiceList] = useState<Voice[]>([]);
  const [voiceReplyList, setVoiceReplyList] = useState<VoiceReply[]>([]);
  const [currentVoiceId, setCurrentVoiceId] = useState<number | null>(null);

  const fetchVoices = async () => {
    try {
      const voices = await getFolloweeVoiceList();
      setVoiceList(voices);
      if (voices.length > 0) {
        setCurrentVoiceId(voices[0].voiceId);
      }
      ///
      console.log('[VoicePage] 보이스 패치 성공:', voices);
      ///
    } catch (error) {
      ///
      console.error('[VoicePage] 보이스 패치 실패:', error);
      ///
    }
  };

  const fetchVoiceReplies = async () => {
    try {
      const replies = await getVoiceReplyList();
      setVoiceReplyList(replies);
      ///
      console.log('[VoicePage] 보이스 답장 패치 성공:', replies);
      ///
    } catch (error) {
      ///
      console.error('[VoicePage] 보이스 답장 패치 실패:', error);
      ///
    }
  };

  useEffect(() => {
    fetchVoices();
    fetchVoiceReplies();
  }, [hasRecordedVoice]);

  const handleMicClick = () => {
    setIsModalOpen(true);
    console.log('[VoicePage] 마이크 버튼 클릭, 모달 열림.');
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
    console.log('[VoicePage] 모달 닫힘.');
  };

  const handleRecordComplete = () => {
    setHasRecordedVoice(true);
    setIsModalOpen(false);
    fetchVoices();
    console.log('[VoicePage] 녹음 완료, 보이스 목록 갱신.');
  };

  const handleDeleteComplete = () => {
    setHasRecordedVoice(false);
    setIsModalOpen(false);
    fetchVoices();
    console.log('[VoicePage] 보이스 삭제 완료, 보이스 목록 갱신.');
  };

  return (
    <div className="container-header-nav overflow-hidden">
      <Header left="home" right="notification" />
      <BubbleBackground />
      <VoiceReplyList voiceReplies={voiceReplyList} />
      <VoiceBubbleList voices={voiceList} />
      <div className="fixed bottom-28 right-4 z-50">
        <button onClick={handleMicClick} className="relative w-[72px] h-[72px]">
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
        {hasRecordedVoice && currentVoiceId !== null ? (
          <VoiceManageModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onDeleteComplete={handleDeleteComplete}
            voiceId={currentVoiceId}
          />
        ) : (
          <VoiceRecordModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onRecordComplete={handleRecordComplete}
          />
        )}
      </div>
    </div>
  );
};

export default VoicePage;
