import { VoiceReply } from '@/types/voice';

interface VoiceReplyItemProps {
  data: VoiceReply;
  onReplyClick: (voiceReply: VoiceReply) => void;
}

const VoiceReplyItem = ({ data, onReplyClick }: VoiceReplyItemProps) => {
  return (
    <div
      onClick={() => onReplyClick(data)}
      className="cursor-pointer flex flex-col items-center"
    >
      <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden mb-2">
        {/* 나중에 실제 프로필 이미지로 교체 */}
        <img
          src={
            data.profileImageUrl ||
            `https://i.pravatar.cc/150?u=${data.personalId}`
          }
          alt="profile"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default VoiceReplyItem;
