import { useState, useEffect } from 'react';
import VoiceReplyItem from '@/components/Voice/VoiceReplyItem';
import VoiceReplyModal from '@/components/Voice/Modals/VoiceReplyModal';
import { VoiceReply } from '@/types/voice';
import { deleteVoiceReply } from '@/api/voice';

interface VoiceReplyListProps {
  voiceReplies: VoiceReply[];
  onReplyRemove: (replyId: number) => void;
}

const VoiceReplyList = ({
  voiceReplies,
  onReplyRemove,
}: VoiceReplyListProps) => {
  const [selectedReplyId, setSelectedReplyId] = useState<VoiceReply | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localVoiceReplies, setLocalVoiceReplies] = useState(voiceReplies);

  useEffect(() => {
    setLocalVoiceReplies(voiceReplies);
  }, [voiceReplies]);

  const handleReplyClick = (voiceReply: VoiceReply) => {
    console.log('[VoiceReplyList] 선택된 답장:', voiceReply);
    setSelectedReplyId(voiceReply);
    setIsModalOpen(true);
  };

  const handleModalClose = async () => {
    if (selectedReplyId) {
      try {
        await deleteVoiceReply(selectedReplyId.voiceReplyId);
        // 로컬 상태 즉시 업데이트
        setLocalVoiceReplies((prev) =>
          prev.filter(
            (reply) => reply.voiceReplyId !== selectedReplyId.voiceReplyId
          )
        );
        onReplyRemove(selectedReplyId.voiceReplyId);
      } catch (error) {
        console.error('[VoiceReplyList] 답장 삭제 실패:', error);
      }
    }
    setIsModalOpen(false);
    setSelectedReplyId(null);
  };

  return (
    <>
      <div className="flex flex-col z-10 pt-5">
        <h4 className="text-lg pl-4 mb-2">Voice Replies</h4>
        {localVoiceReplies.length === 0 ? (
          <div className="min-w-[22rem] px-4">
            <div
              className="relative w-full h-[85px] flex-shrink-0 rounded-full flex justify-center items-center px-4"
              style={{
                boxShadow: 'inset 3px 3px 5px 0px rgba(255, 255, 255, 0.7)',
              }}
            >
              <div
                className="absolute inset-0 rounded-full opacity-10 backdrop-blur-lg"
                style={{
                  background:
                    'radial-gradient(185.01% 93.71% at 23.1% 30.59%, #6B36FE 31.22%, rgba(255, 255, 255, 0) 100%), #B5B4F2',
                }}
              ></div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-gray-800 text-lg font-light">
                  No reply yet ⏳
                </p>
                <p className="text-gray-700 text-sm font-extralight">
                  Still waiting for a reply...
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-4">
            <div
              className="relative w-full min-w-[20rem] max-w-[25rem] flex-shrink-0 rounded-full flex items-center px-4 py-3"
              style={{
                boxShadow: 'inset 3px 3px 5px 0px rgba(255, 255, 255, 0.7)',
              }}
            >
              <div
                className="absolute inset-0 rounded-full opacity-10 backdrop-blur-lg"
                style={{
                  background:
                    'radial-gradient(185.01% 93.71% at 23.1% 30.59%, #6B36FE 31.22%, rgba(255, 255, 255, 0) 100%), #B5B4F2',
                }}
              ></div>

              <div className="relative flex items-center space-x-4 z-10">
                {localVoiceReplies.map((reply) => (
                  <VoiceReplyItem
                    key={reply.voiceReplyId}
                    data={reply}
                    onReplyClick={handleReplyClick}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <VoiceReplyModal
        replyData={selectedReplyId || undefined}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </>
  );
};

export default VoiceReplyList;
