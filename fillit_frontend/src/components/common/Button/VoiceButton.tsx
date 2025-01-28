interface VoiceButtonProps {
  text?: string;
  onClick?: () => void;
  isPlayComplete?: boolean;
  color?: string;
}

const VoiceButton = ({
  text,
  onClick,
  isPlayComplete = false,
  color = '#4F4A85',
}: VoiceButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex w-[121px] h-[34px] items-center justify-center gap-2.5 px-[30px] py-1.5 bg-white rounded-[5px] font-normal text-xl tracking-[0] leading-5 whitespace-nowrap"
      style={{ color: color }}
    >
      {isPlayComplete ? 'Reply' : text || 'Voice'}
    </button>
  );
};

export default VoiceButton;
