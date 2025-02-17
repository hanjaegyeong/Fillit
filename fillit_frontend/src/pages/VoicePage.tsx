import Header from '@/components/common/Header/Header';
import VoiceBackground from '@/components/Voice/VoiceBackground';
import VoiceBubbleList from '@/components/Voice/VoiceBubbleList';
import { mic, speaker } from '@/assets/assets';
import VoiceReplyList from '@/components/Voice/VoiceReplyList';
import VoiceManageModal from '@/components/Voice/Modals/VoiceManageModal';
import VoiceRecordModal from '@/components/Voice/Modals/VoiceRecordModal';
import { useState, useEffect } from 'react';
import { getFolloweeVoiceList, getVoiceReplyList, getVoice } from '@/api/voice';
import { Voice, VoiceReply } from '@/types/voice';
import BubbleAnimation from '@/components/Voice/BubbleAnimation';

const VoicePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 내 음성 데이터 여부는 RecordModal의 onRecordComplete를 통해 업데이트됨
  const [hasRecordedVoice, setHasRecordedVoice] = useState(false);
  const [voiceList, setVoiceList] = useState<Voice[]>([]);
  const [voiceReplyList, setVoiceReplyList] = useState<VoiceReply[]>([]);
  const [myVoiceId, setMyVoiceId] = useState<number | null>(null);
  const [showBubbleAnimation, setShowBubbleAnimation] = useState(false);

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

  const checkMyVoice = async () => {
    try {
      const myVoice = await getVoice();
      if (myVoice && myVoice.voiceId) {
        setHasRecordedVoice(true);
        setMyVoiceId(myVoice.voiceId);
      } else {
        setHasRecordedVoice(false);
        setMyVoiceId(null);
      }
    } catch (error) {
      setHasRecordedVoice(false);
      setMyVoiceId(null);
    }
  };

  useEffect(() => {
    // 최초 렌더링시에만 음성 목록을 가져옴
    fetchVoices();
    fetchVoiceReplies();
    checkMyVoice();
  }, []); // 빈 의존성 배열

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
    console.log('[VoiceBubbleList] 모달 닫힘.');
  };

  // onRecordComplete: RecordModal에서 내 보이스 데이터의 voiceId를 받아 상태 업데이트
  const handleRecordComplete = (voiceId: number) => {
    setHasRecordedVoice(true);
    setMyVoiceId(voiceId);
    setIsModalOpen(false);
    setShowBubbleAnimation(true); // 즉시 애니메이션 시작
    fetchVoices();

    // 3초 후 애니메이션 숨기기
    setTimeout(() => {
      setShowBubbleAnimation(false);
    }, 3000);
  };

  const handleDeleteComplete = () => {
    setHasRecordedVoice(false);
    setMyVoiceId(null);
    setIsModalOpen(false);
    // 삭제된 보이스를 현재 리스트에서 제거
    setVoiceList((prev) => prev.filter((voice) => voice.voiceId !== myVoiceId));
    setVoiceReplyList([]);
  };

  const handleVoiceRemove = (voiceId: number) => {
    setVoiceList((prev) => prev.filter((voice) => voice.voiceId !== voiceId));
  };

  const handleReplyRemove = (replyId: number) => {
    setVoiceReplyList((prev) =>
      prev.filter((reply) => reply.voiceReplyId !== replyId)
    );
  };

  return (
    <div className="container-header-nav overflow-hidden">
      <Header left="home" right="notification" />
      <VoiceBackground />
      <VoiceReplyList
        voiceReplies={voiceReplyList}
        onReplyRemove={handleReplyRemove}
      />
      <VoiceBubbleList voices={voiceList} onVoiceRemove={handleVoiceRemove} />

      <div className="w-full max-w-[600px] z-20 flex justify-end px-4 fixed bottom-28">
        <button onClick={handleMicClick} className="relative w-20 h-20">
          <div className="w-20 h-20 bg-white rounded-full border flex items-center justify-center border-[#B5B4F2] shadow-md">
            <div
              className={`w-12 h-12 ${
                hasRecordedVoice ? 'pt-0.5' : 'pl-[0.05rem]'
              }`}
            >
              <img
                src={hasRecordedVoice ? speaker : mic}
                alt="voice-status-icon"
              />
            </div>
          </div>
        </button>
      </div>

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
      <BubbleAnimation isVisible={showBubbleAnimation} />
    </div>
  );
};

export default VoicePage;
