interface ProfileIntroductionProps {
  introduction: string;
}

const ProfileIntroduction = ({ introduction }: ProfileIntroductionProps) => {
  return (
    <div className="w-full px-5 flex justify-center">
      <div className="w-full max-w-[22rem] h-[4.5rem] mt-6 bg-[#ffffff4c] rounded-[5px] flex items-center justify-center">
        <p className="font-light text-black tracking-[0] leading-[15px] text-center px-8 text-sm">
          {introduction}
        </p>
      </div>
    </div>
  );
};

export default ProfileIntroduction;
