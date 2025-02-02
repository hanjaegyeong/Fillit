import { profileBubble, playIcon, voiceWrapper } from '@/assets/assets';

interface VoiceBubbleItemProps {
  name: string;
  personalId: string;
  onPlayClick: () => void;
}

const VoiceBubbleItem = ({
  name,
  personalId,
  onPlayClick,
}: VoiceBubbleItemProps) => {
  return (
    <div
      className="flex items-center bg-no-repeat bg-cover bg-center shadow-md rounded-xl p-4"
      style={{
        backgroundImage: `url(${voiceWrapper})`,
        width: '100%',
        maxWidth: '346px',
        height: '73px',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: '20px',
      }}
    >
      {/* 프로필 이미지*/}
      <img
        src={profileBubble}
        alt="profile"
        className="w-12 h-12 rounded-full mr-4"
      />
      {/* 텍스트 */}
      <div className="flex-1">
        <p className="font-bold text-lg truncate">{name}</p>
        <p className="text-gray-500 text-sm truncate">@{personalId}</p>
      </div>
      {/* 플레이버튼 */}
      <button
        onClick={onPlayClick}
        className="flex items-center justify-center w-10 h-10 bg-transparent rounded-full"
      >
        <img src={playIcon} alt="play" className="w-6 h-6" />
      </button>
    </div>
  );
};

export default VoiceBubbleItem;
