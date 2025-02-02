export interface VoiceReplyData {
  id: string;
  audioUrl: string;
  createdAt: string;
  userId: string;
  voiceId: string;
}

interface VoiceReplyItemProps {
  data: VoiceReplyData;
  onReplyClick: (replyId: string) => void;
}

const VoiceReplyItem = ({ data, onReplyClick }: VoiceReplyItemProps) => {
  return (
    <div
      onClick={() => onReplyClick(data.id)}
      className="cursor-pointer flex flex-col items-center"
    >
      <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden mb-2">
        {/* 나중에 실제 프로필 이미지로 교체 */}
        <img
          src={`https://i.pravatar.cc/150?u=${data.userId}`}
          alt="profile"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default VoiceReplyItem;
