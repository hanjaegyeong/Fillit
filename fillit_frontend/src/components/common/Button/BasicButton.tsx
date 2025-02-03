interface BasicButtonProps {
  text?: string;
  onClick?: () => void;
  width?: string;
  height?: string;
}

const BasicButton = ({
  text = 'Login',
  onClick,
  width = '110px',
  height = '40px',
}: BasicButtonProps) => {
  return (
    <button
      className="from-white to-transparent p-[4px] rounded-[16px]"
      onClick={onClick}
      style={{ width, height }}
    >
      <div className="group rounded-[5px] bg-gradient-to-b from-white shadow-[0_4px_4px_rgba(0,0,0,0.25),_0_1px_10px_rgba(0,0,0,8%)]  active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995] h-full">
        <div className="px-5 bg-gradient-to-b from-white to-white/80 rounded-[8px] h-full flex items-center justify-center">
          <span className="text-[#5e72e4] text-lg leading-none -translate-y-[1px]">
            {text}
          </span>
        </div>
      </div>
    </button>
  );
};

export default BasicButton;
