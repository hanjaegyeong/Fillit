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
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasRecordedVoice, setHasRecordedVoice] = useState(false);
  const [voiceList, setVoiceList] = useState<Voice[]>([]);
  const [voiceReplyList, setVoiceReplyList] = useState<VoiceReply[]>([]);
  const [myVoiceData, setMyVoiceData] = useState<Voice | null>(null);
  const [showBubbleAnimation, setShowBubbleAnimation] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const preloadImages = async () => {
      const images = [mic, speaker];
      try {
        await Promise.all(
          images.map((src) => {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.src = src;
              img.onload = resolve;
              img.onerror = reject;
            });
          })
        );
        setIsImageLoaded(true);
      } catch (error) {
        console.error('[VoicePage] 이미지 프리로딩 실패:', error);
        setIsImageLoaded(true); // 실패해도 UI는 보여주기
      }
    };
    preloadImages();
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      if (!isImageLoaded) return; // 이미지가 로드되기 전까지 데이터 로딩 지연
      setIsLoading(true);
      try {
        await Promise.all([fetchVoices(), fetchVoiceReplies(), checkMyVoice()]);
      } catch (error) {
        console.error('[VoicePage] 초기 데이터 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [isImageLoaded]);

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
        setMyVoiceData(myVoice);
      } else {
        setHasRecordedVoice(false);
        setMyVoiceData(null);
      }
    } catch (error) {
      setHasRecordedVoice(false);
      setMyVoiceData(null);
    }
  };

  const handleMicClick = async () => {
    try {
      const myVoice = await getVoice();
      if (myVoice && myVoice.voiceId) {
        setHasRecordedVoice(true);
        setMyVoiceData(myVoice);
      } else {
        setHasRecordedVoice(false);
        setMyVoiceData(null);
      }
    } catch (error) {
      console.error('[VoicePage] getVoice API 호출 실패:', error);
      setHasRecordedVoice(false);
      setMyVoiceData(null);
    }
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // onRecordComplete: RecordModal에서 내 보이스 데이터의 voiceId를 받아 상태 업데이트
  const handleRecordComplete = (voiceId: number) => {
    setHasRecordedVoice(true);
    setMyVoiceData({
      voiceId,
      name: '',
      audioUrl: '',
      personalId: '',
      profileImageUrl: '',
    });
    setIsModalOpen(false);
    setShowBubbleAnimation(true); // 즉시 애니메이션 시작
    fetchVoices();

    // 3초 후 애니메이션 숨기기
    setTimeout(() => {
      checkMyVoice();
      setShowBubbleAnimation(false);
    }, 3000);
  };

  const handleDeleteComplete = () => {
    setHasRecordedVoice(false);
    setMyVoiceData(null);
    setIsModalOpen(false);
    // 삭제된 보이스를 현재 리스트에서 제거
    setVoiceList((prev) =>
      prev.filter((voice) => voice.voiceId !== myVoiceData?.voiceId)
    );
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

      <div
        className={`w-full max-w-[600px] z-[10] flex justify-end px-4 fixed bottom-28 transition-all duration-300 ${
          isModalOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {isLoading || !isImageLoaded ? (
          <div className="w-20 h-20 bg-white rounded-full border border-[#B5B4F2] shadow-md flex items-center justify-center">
            <div className="w-12 h-12 bg-gray-200 animate-pulse rounded-full" />
          </div>
        ) : (
          <button onClick={handleMicClick} className="relative w-20 h-20">
            <div className="w-20 h-20 bg-white rounded-full border flex items-center justify-center border-[#B5B4F2] shadow-md">
              <div
                className={`w-12 h-12 ${
                  hasRecordedVoice ? 'pt-0.5' : 'pl-[0.05rem] -translate-y-1'
                }`}
              >
                <img
                  src={hasRecordedVoice ? speaker : mic}
                  alt="voice-status-icon"
                  className="transition-all duration-300"
                />
              </div>
            </div>
          </button>
        )}
      </div>

      {/* 모달은 이미지와 데이터가 모두 로드된 후에만 렌더링 */}
      {!isLoading && isImageLoaded && (
        <>
          {hasRecordedVoice && myVoiceData ? (
            <VoiceManageModal
              isOpen={isModalOpen}
              onClose={handleModalClose}
              onDeleteComplete={handleDeleteComplete}
              voiceData={myVoiceData}
            />
          ) : (
            <VoiceRecordModal
              isOpen={isModalOpen}
              onClose={handleModalClose}
              onRecordComplete={handleRecordComplete}
            />
          )}
        </>
      )}
      <BubbleAnimation isVisible={showBubbleAnimation} />
    </div>
  );
};

export default VoicePage;
