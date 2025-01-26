import { BubbleBackground } from '../components/decorations/BubbleBackground';
import VoiceBubbleList from '../components/VoiceBubbleList';
import MicBack from '../assets/icons/mic-back.svg';
import Mic from '../assets/icons/mic.svg';

const Voice = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <BubbleBackground />
      <VoiceBubbleList />
      <div className="fixed bottom-28 right-4 z-50">
        <button className="relative w-16 h-16">
          <div className="absolute inset-0 w-20 h-20 -translate-x-2 -translate-y-2">
            <img src={MicBack} alt="mic-back" className="w-full h-full" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <img src={Mic} alt="mic" className="w-16 h-16" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default Voice;
