import { bubble1, bubble2, bubble3 } from '@/assets/assets';

const VoiceBackground = () => {
  return (
    <div>
      <img
        src={bubble1}
        alt="bubble1"
        className="absolute w-[317px] h-[325px] top-0 right-0 object-cover scale-110  "
      />
      <img
        src={bubble2}
        alt="bubble2"
        className="absolute w-[323px] h-[497px] top-[127px] left-0 object-cover scale-110"
      />
      <img
        src={bubble3}
        alt="bubble3"
        className="absolute w-[391px] h-[587px] right-0 bottom-0 scale-110"
      />
    </div>
  );
};

export default VoiceBackground;
