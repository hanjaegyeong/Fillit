import { BubbleBackground } from '../components/decorations/BubbleBackground';
import VoiceBubbleList from '../components/VoiceBubbleList';

const Voice = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <BubbleBackground />
      <VoiceBubbleList />
    </div>
  );
};

export default Voice;
