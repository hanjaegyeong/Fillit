import { motion, AnimatePresence } from 'framer-motion';
import { playIcon } from '@/assets/assets';
import { Voice } from '@/types/voice';
import ProfileImage from '@/components/common/ProfileImage';

interface VoiceBubbleItemProps {
  voice: Voice;
  onPlayClick: (voice: Voice) => void;
}

const VoiceBubbleItem = ({ voice, onPlayClick }: VoiceBubbleItemProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{
          scale: [1, 1.2, 0],
          opacity: [1, 1, 0],
          rotate: [0, 10, -10],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1],
          exit: {
            duration: 0.4,
            times: [0, 0.6, 1],
          },
        }}
        className="flex items-center bg-white opacity-80 shadow-md rounded-xl py-3 px-4"
      >
        {/* 프로필 이미지*/}
        <div className="w-12 h-12 flex items-center rounded-full ml-1 mr-4 cursor-pointer">
          <ProfileImage
            src={voice.profileImageUrl}
            personalId={voice.personalId}
            alt="profile"
          />
        </div>
        {/* 텍스트 */}
        <div className="flex-1">
          <p className="font-semibold text-lg truncate">{voice.name}</p>
          <p className="text-gray-500 text-sm truncate">@{voice.personalId}</p>
        </div>
        {/* 플레이버튼 */}
        <button
          onClick={() => onPlayClick(voice)}
          className="flex items-center justify-center w-10 h-10 bg-transparent rounded-full"
        >
          <img src={playIcon} alt="play" className="w-6 h-6" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default VoiceBubbleItem;
