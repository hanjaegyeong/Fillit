import { playIcon, voiceWrapper } from '@/assets/assets';
import { Voice } from '@/types/voice';
import { useNavigate } from 'react-router-dom';
import useNavStore from '@/store/useNavStore';
import ProfileImage from '../common/ProfileImage';

interface VoiceBubbleItemProps {
  voice: Voice;
  onPlayClick: (voice: Voice) => void;
}

const VoiceBubbleItem = ({ voice, onPlayClick }: VoiceBubbleItemProps) => {
  const navigate = useNavigate();
  const setActiveNavItem = useNavStore((state) => state.setActiveNavItem);

  const handleProfileClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setActiveNavItem('myPage');
    navigate(`/profile/${voice.personalId}`);
  };

  return (
    <div
      className="flex items-center bg-no-repeat bg-cover bg-center shadow-md rounded-xl p-4"
      style={{
        backgroundImage: `url(${voiceWrapper})`,
        width: '100%',
        maxWidth: '346px',
        height: '73px',
        position: 'relative',
      }}
    >
      {/* 프로필 이미지*/}
      <div className="w-12 h-12 rounded-full mr-4 cursor-pointer">
        <ProfileImage
          src={voice.profileImageUrl}
          onClick={handleProfileClick}
          alt="profile"
        />
      </div>
      {/* 텍스트 */}
      <div className="flex-1">
        <p className="font-bold text-lg truncate">{voice.personalId}</p>
        <p className="text-gray-500 text-sm truncate">@{voice.personalId}</p>
      </div>
      {/* 플레이버튼 */}
      <button
        onClick={() => onPlayClick(voice)}
        className="flex items-center justify-center w-10 h-10 bg-transparent rounded-full"
      >
        <img src={playIcon} alt="play" className="w-6 h-6" />
      </button>
    </div>
  );
};

export default VoiceBubbleItem;
