import { DmIcon } from '@/assets/assets';

export const DmButton = () => {
  return (
    <div>
      <button className="flex items-center justify-center w-5 h-5 bg-white rounded-[4rem] border border-solid border-black shadow-[1px_1px_0px_000000] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]">
        <img src={DmIcon} alt="dm icon" className="w-3 h-3" />
      </button>
    </div>
  );
};
