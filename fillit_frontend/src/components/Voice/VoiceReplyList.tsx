import { useState } from 'react';
import VoiceReplyItem, { VoiceReplyData } from './VoiceReplyItem';
import VoiceReplyModal from './Modals/VoiceReplyModal';
import { replyBar } from '@/assets/assets';

const VoiceReplyList = () => {
  const [selectedReplyId, setSelectedReplyId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 임시 데이터 배열
  const mockReplies: VoiceReplyData[] = Array.from({ length: 10 }, (_, i) => ({
    id: `${i + 1}`,
    audio_url: `https://example.com/audio${i + 1}.mp3`,
    created_at: new Date().toISOString(),
    user_id: `user${i + 1}`,
    voice_id: 'voice1',
  }));

  const handleReplyClick = (replyId: string) => {
    setSelectedReplyId(replyId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedReplyId(null);
  };

  return (
    <div className="relative">
      <div className="absolute w-[95%] h-auto top-[90px] left-1/2 transform -translate-x-1/2">
        <img src={replyBar} alt="reply-bar" className="w-full h-auto" />
        <div className="absolute inset-0 flex items-center justify-center translate-y-[6px]">
          <div className="w-[88%] overflow-x-auto hide-scrollbar -translate-x-1">
            <div className="flex items-center justify-start gap-4 min-w-min px-6">
              {mockReplies.map((reply) => (
                <VoiceReplyItem
                  key={reply.id}
                  data={reply}
                  onReplyClick={handleReplyClick}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <VoiceReplyModal
        replyData={mockReplies.find((reply) => reply.id === selectedReplyId)}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default VoiceReplyList;
