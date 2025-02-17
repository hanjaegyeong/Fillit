import { bubble1, bubble2, bubble3 } from '@/assets/assets';

const VoiceBackground = () => {
  return (
    <div className="relative w-[600px]">
      <img
        src={bubble1}
        alt="bubble1"
        className="absolute size-[380px] -top-[100px] right-[20px] object-cover animate-float-slow transition-transform duration-300"
      />
      <img
        src={bubble2}
        alt="bubble2"
        className="absolute size-[480px] top-[80px] -left-[40px] animate-float-medium transition-transform duration-500"
      />
      <img
        src={bubble3}
        alt="bubble3"
        className="absolute size-[600px] -right-[80px] top-[250px] animate-float-fast transition-opacity duration-100"
      />
    </div>
  );
};

export default VoiceBackground;
