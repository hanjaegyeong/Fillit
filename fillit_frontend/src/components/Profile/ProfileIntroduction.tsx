interface ProfileIntroductionProps {
  introduction: string;
}

const ProfileIntroduction = ({ introduction }: ProfileIntroductionProps) => {
  return (
    <div className="flex justify-center">
      <div className="w-[22rem] h-[3.2rem] mt-5 bg-[#ffffff4c] rounded-[5px] flex items-center justify-center">
        <p className="font-light text-black tracking-[0] leading-[15px] text-center px-8 text-xs">
          {introduction}
        </p>
      </div>
    </div>
  );
};

export default ProfileIntroduction;
