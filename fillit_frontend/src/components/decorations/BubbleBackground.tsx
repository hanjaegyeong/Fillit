import { bubble1, bubble2, bubble3, replyBar } from '@/assets/assets';

export const BubbleBackground = () => {
  return (
    <div className="absolute inset-0 z-[-1]">
      <img
        src={bubble1}
        alt="bubble1"
        className="absolute w-[317px] h-[325px] top-0 right-0 object-cover"
      />
      <img
        src={bubble2}
        alt="bubble2"
        className="absolute w-[323px] h-[497px] top-[127px] left-0 object-cover"
      />
      <img
        src={bubble3}
        alt="bubble3"
        className="absolute w-[391px] h-[587px] right-0 bottom-0"
      />
      <div className="relative">
        <h4 className="text-xl mb-2 absolute top-[50px] left-1/2 transform -translate-x-1/2 z-10 text-center w-full">
          Voice Replies
        </h4>
        <img
          src={replyBar}
          alt="replyBar"
          className="absolute w-[95%] h-auto top-[90px] left-1/2 transform -translate-x-1/2"
        />
      </div>
    </div>
  );
};
