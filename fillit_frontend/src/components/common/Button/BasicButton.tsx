interface BasicButtonProps {
  text?: string;
}

const BasicButton = ({ text = 'Login' }: BasicButtonProps) => {
  return (
    <>
      <div className=" from-white to-transparent p-[4px] rounded-[16px]">
        <button className="group rounded-[5px] bg-gradient-to-b from-white shadow-[0_1px_3px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]">
          <div className="px-5 bg-gradient-to-b from-white to-white/80 rounded-[8px] py-1">
            <div className="flex gap-2 items-center">
              <span className="text-indigo-700 text-lg">{text}</span>
            </div>
          </div>
        </button>
      </div>
    </>
  );
};

export default BasicButton;
