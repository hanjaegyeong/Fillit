interface VoiceButtonProps {
  text?: string;
  onClick?: () => void;
  isPlayComplete?: boolean;
}

const VoiceButton = ({
  text,
  onClick,
  isPlayComplete = false,
}: VoiceButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex w-[121px] h-[34px] items-center justify-center gap-2.5 px-[30px] py-1.5 bg-white rounded-[5px] font-normal text-[#5e72e4] text-xl tracking-[0] leading-5 whitespace-nowrap"
    >
      {isPlayComplete ? 'Reply' : text || 'Voice'}
    </button>
  );
};

export default VoiceButton;
