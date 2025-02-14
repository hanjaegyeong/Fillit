import { bubble1, bubble2, bubble3 } from '@/assets/assets';

const VoiceBackground = () => {
  return (
    <div>
      <img
        src={bubble1}
        alt="bubble1"
        className="absolute w-[317px] h-[325px] top-0 right-0 object-cover animate-float-slow hover:rotate-12 transition-transform duration-700"
      />
      <img
        src={bubble2}
        alt="bubble2"
        className="absolute w-[323px] h-[497px] top-[127px] left-0 object-cover animate-float-medium hover:scale-110 transition-transform duration-500"
      />
      <img
        src={bubble3}
        alt="bubble3"
        className="absolute w-[391px] h-[587px] right-0 bottom-0 animate-float-fast hover:opacity-80 transition-opacity duration-300"
      />
    </div>
  );
};

export default VoiceBackground;
