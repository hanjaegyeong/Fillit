import Header from '@/components/common/Header/Header';
import VoiceBackground from '@/components/Voice/VoiceBackground';
import VoiceBubbleList from '@/components/Voice/VoiceBubbleList';
import { micBack, mic } from '@/assets/assets';
import VoiceReplyList from '@/components/Voice/VoiceReplyList';
import VoiceManageModal from '@/components/Voice/Modals/VoiceManageModal';
import VoiceRecordModal from '@/components/Voice/Modals/VoiceRecordModal';
import { useState, useEffect } from 'react';
import { getFolloweeVoiceList, getVoiceReplyList, getVoice } from '@/api/voice';
import { Voice, VoiceReply } from '@/types/voice';

const VoicePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 내 음성 데이터 여부는 RecordModal의 onRecordComplete를 통해 업데이트됨
  const [hasRecordedVoice, setHasRecordedVoice] = useState(false);
  const [voiceList, setVoiceList] = useState<Voice[]>([]);
  const [voiceReplyList, setVoiceReplyList] = useState<VoiceReply[]>([]);
  const [myVoiceId, setMyVoiceId] = useState<number | null>(null);

  const fetchVoices = async () => {
    try {
      const voices = await getFolloweeVoiceList();
      setVoiceList(voices);
    } catch (error) {
      console.error('[VoicePage] 팔로위 보이스 패치 실패:', error);
    }
  };

  const fetchVoiceReplies = async () => {
    try {
      const replies = await getVoiceReplyList();
      setVoiceReplyList(replies);
    } catch (error) {
      setVoiceReplyList([]);
      console.error('[VoicePage] 내 음성 답장 패치 실패:', error);
    }
  };

  useEffect(() => {
    fetchVoices();
    fetchVoiceReplies();
  }, [hasRecordedVoice]);

  const handleMicClick = async () => {
    try {
      const myVoice = await getVoice();
      if (myVoice && myVoice.voiceId) {
        setHasRecordedVoice(true);
        setMyVoiceId(myVoice.voiceId);
        console.log(myVoice.voiceId);
      } else {
        setHasRecordedVoice(false);
        setMyVoiceId(null);
      }
    } catch (error) {
      console.error('[VoicePage] getVoice API 호출 실패:', error);
      setHasRecordedVoice(false);
      setMyVoiceId(null);
    }
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // onRecordComplete: RecordModal에서 내 보이스 데이터의 voiceId를 받아 상태 업데이트
  const handleRecordComplete = (voiceId: number) => {
    setHasRecordedVoice(true);
    setMyVoiceId(voiceId);
    setIsModalOpen(false);
    fetchVoices();
  };

  const handleDeleteComplete = () => {
    setHasRecordedVoice(false);
    setMyVoiceId(null);
    setIsModalOpen(false);
    fetchVoices();
    setVoiceReplyList([]);
  };

  return (
    <div className="container-header-nav overflow-hidden">
      <Header left="home" right="notification" />
      <VoiceBackground />
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
        {/* 모달 선택: 내 보이스 데이터가 있으면 ManageModal, 없으면 RecordModal */}
        {hasRecordedVoice && myVoiceId !== null ? (
          <VoiceManageModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onDeleteComplete={handleDeleteComplete}
            voiceId={myVoiceId}
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
