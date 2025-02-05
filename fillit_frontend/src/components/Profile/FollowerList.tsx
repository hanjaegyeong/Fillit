import { FollowBackground } from '@/assets/assets';
import FollowerItem from './FollowerItem';

const FollowerList = () => {
  return (
    <div className="overflow-hidden grid">
      <img
        src={FollowBackground}
        className="scale-[2.0] mt-[40px] origin-top row-start-1 col-start-1"
        alt="follow background"
      />
      <div className="row-start-1 col-start-1 z-10 mt-[12rem]">
        <FollowerItem />
      </div>
    </div>
  );
};

export default FollowerList;
