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
  // hasRecordedVoice는 오직 로컬 스토리지의 "recordedVoiceData" 존재 여부로 판단
  const [hasRecordedVoice, setHasRecordedVoice] = useState(false);
  const [voiceList, setVoiceList] = useState<Voice[]>([]);
  const [voiceReplyList, setVoiceReplyList] = useState<VoiceReply[]>([]);

  // [수정] 내 음성 데이터는 API의 결과가 아니라 로컬 스토리지 기반으로 판단합니다.
  // (예: 백엔드에서 내 음성 데이터를 별도 제공하지 않는 경우)
  // 따라서, currentVoiceId는 본인의 음성 id가 아니라, ManageModal 호출에 사용할 값입니다.
  // 여기서는 간단하게 로컬 스토리지에 "myVoiceId"가 있다면 그 값을 사용하도록 가정합니다.
  const [myVoiceId, setMyVoiceId] = useState<number | null>(null);

  const fetchVoices = async () => {
    try {
      const voices = await getFolloweeVoiceList();
      setVoiceList(voices);
      console.log('[VoicePage] 팔로위 보이스 패치 성공:', voices);
    } catch (error) {
      console.error('[VoicePage] 팔로위 보이스 패치 실패:', error);
    }
  };

  const fetchVoiceReplies = async () => {
    try {
      const replies = await getVoiceReplyList();
      setVoiceReplyList(replies);
      console.log('[VoicePage] 내 음성 답장 패치 성공:', replies);
    } catch (error) {
      setVoiceReplyList([]);
      console.error('[VoicePage] 내 음성 답장 패치 실패:', error);
    }
  };

  // 컴포넌트 마운트 시 로컬 스토리지에서 내 녹음 데이터와 내 음성 id 확인
  useEffect(() => {
    const recordedData = localStorage.getItem('recordedVoiceData');
    if (recordedData) {
      setHasRecordedVoice(true);
      console.log('[VoicePage] 저장된 녹음 데이터가 발견됨.');
    } else {
      setHasRecordedVoice(false);
      console.log('[VoicePage] 저장된 녹음 데이터가 없음.');
    }
    // 내 음성 id가 있다면 가져오기 (만약 업로드 후 서버에서 반환하는 값이 localStorage에 "myVoiceId"로 저장된다면)
    const myVoiceIdStr = localStorage.getItem('myVoiceId');
    if (myVoiceIdStr) {
      setMyVoiceId(Number(myVoiceIdStr));
      console.log('[VoicePage] 저장된 내 음성 ID:', myVoiceIdStr);
    } else {
      setMyVoiceId(null);
      console.log('[VoicePage] 저장된 내 음성 ID가 없음.');
    }
  }, []);

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

  // onRecordComplete: 녹음 완료 시 호출되어 내 음성 데이터가 있다고 표시
  const handleRecordComplete = () => {
    console.log(
      '[VoicePage] handleRecordComplete 실행됨. hasRecordedVoice를 true로 설정합니다.'
    );
    setHasRecordedVoice(true);
    // 여기서 만약 백엔드에서 내 음성 업로드 후 내 음성 id를 반환한다면,
    // 해당 값을 localStorage에 "myVoiceId"로 저장하고 상태로 업데이트합니다.
    // 예: localStorage.setItem('myVoiceId', voiceId.toString());
    setIsModalOpen(false);
    fetchVoices();
    console.log('[VoicePage] 녹음 완료, 보이스 목록 갱신.');
  };

  const handleDeleteComplete = () => {
    console.log(
      '[VoicePage] handleDeleteComplete 실행됨. hasRecordedVoice를 false로 설정합니다.'
    );
    setHasRecordedVoice(false);
    // 내 음성 id도 제거
    localStorage.removeItem('myVoiceId');
    setMyVoiceId(null);
    setIsModalOpen(false);
    fetchVoices();
    console.log('[VoicePage] 보이스 삭제 완료, 보이스 목록 갱신.');
  };

  return (
    <div className="container-header-nav overflow-hidden">
      <Header left="home" right="notification" />
      <BubbleBackground />
      {/* 내 음성 답장 목록 (내가 올린 음성에 대한 답장) */}
      <VoiceReplyList voiceReplies={voiceReplyList} />
      {/* 팔로위 음성 스토리 목록 */}
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
        {/* 모달 선택: 내 녹음 데이터(recordedVoiceData)가 있으면 ManageModal, 없으면 RecordModal */}
        {hasRecordedVoice ? (
          <VoiceManageModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onDeleteComplete={handleDeleteComplete}
            // ManageModal에 내 음성 id 전달 (null이면 관리 모달 대신 녹음 모달이 뜰 수 있음)
            voiceId={myVoiceId || 0}
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
