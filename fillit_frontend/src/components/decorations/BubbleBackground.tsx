import bubble1 from '/src/assets/images/bubble1.png';
import bubble2 from '/src/assets/images/bubble2.png';
import bubble3 from '/src/assets/images/bubble3.png';
import replyBar from '/src/assets/icons/reply-bar.svg';

export const BubbleBackground = () => {
  return (
    <div>
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
      <img
        src={replyBar}
        alt="replyBar"
        className="absolute w-[95%] full h-auto top-[116px] left-1/2 transform -translate-x-1/2"
      />
    </div>
  );
};
