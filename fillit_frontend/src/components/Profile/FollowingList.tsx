import { FollowBackground } from '@/assets/assets';

const FollowingList = () => {
  return (
    <div className="overflow-hidden">
      <img
        src={FollowBackground}
        className="scale-[2.0] mt-[40px] origin-top "
        alt="follow background"
      />
    </div>
  );
};

export default FollowingList;
