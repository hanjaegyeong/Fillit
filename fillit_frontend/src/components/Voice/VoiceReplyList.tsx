import { useState } from 'react';
import VoiceReplyItem, {
  VoiceReplyData,
} from '@/components/Voice/VoiceReplyItem';
import VoiceReplyModal from '@/components/Voice/Modals/VoiceReplyModal';
import { replyBar } from '@/assets/assets';

const VoiceReplyList = () => {
  const [selectedReplyId, setSelectedReplyId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 임시 데이터 배열
  const mockReplies: VoiceReplyData[] = Array.from({ length: 10 }, (_, i) => ({
    id: `${i + 1}`,
    audioUrl: `https://example.com/audio${i + 1}.mp3`,
    createdAt: new Date().toISOString(),
    userId: `user${i + 1}`,
    voiceId: 'voice1',
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
    <>
      <div className="flex flex-col z-10 pt-5">
        <h4 className="text-lg pl-4 mb-2">Voice Replies</h4>
        <div
          className="w-[370px] bg-contain bg-no-repeat py-2.5 px-2"
          style={{ backgroundImage: `url(${replyBar})` }}
        >
          <div className="max-w-full overflow-x-auto hide-scrollbar -translate-x-1 rounded-full px-2">
            <div className="flex items-center space-x-4">
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
    </>
  );
};

export default VoiceReplyList;
