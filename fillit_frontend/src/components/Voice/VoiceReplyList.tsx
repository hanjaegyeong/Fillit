import { useState } from 'react';
import VoiceReplyItem from '@/components/Voice/VoiceReplyItem';
import VoiceReplyModal from '@/components/Voice/Modals/VoiceReplyModal';
import { replyBar } from '@/assets/assets';
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

  const handleReplyClick = (voiceReply: VoiceReply) => {
    console.log('[VoiceReplyList] 선택된 답장:', voiceReply);
    setSelectedReplyId(voiceReply);
    setIsModalOpen(true);
  };

  const handleModalClose = async () => {
    if (selectedReplyId) {
      try {
        await deleteVoiceReply(selectedReplyId.voiceReplyId);
        onReplyRemove(selectedReplyId.voiceReplyId);
      } catch (error) {
        console.error('[VoiceReplyList] 답장 삭제 실패:', error);
      }
    }
    setIsModalOpen(false);
    setSelectedReplyId(null);
    console.log('[VoiceReplyList] 모달 닫힘.');
  };

  return (
    <>
      <div className="flex flex-col z-10 pt-5">
        <h4 className="text-lg pl-4 mb-2">Voice Replies</h4>
        {voiceReplies.length === 0 ? (
          <div className="flex justify-center items-center w-full py-4">
            <p className="text-gray-500 text-lg">No reply yet.</p>
          </div>
        ) : (
          <div
            className="w-[370px] bg-contain bg-no-repeat py-2.5 px-2"
            style={{ backgroundImage: `url(${replyBar})` }}
          >
            <div className="max-w-full overflow-x-auto hide-scrollbar -translate-x-1 rounded-full px-2">
              <div className="flex items-center space-x-4">
                {voiceReplies.map((reply) => (
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
