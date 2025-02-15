import { postRoom } from '@/api/message';
import { DmIcon } from '@/assets/assets';
import { useNavigate } from 'react-router-dom';

interface DmButtonProps {
  otherPersonalId: string;
  otherUserName: string;
  otherProfileImageUrl: string;
}

export const DmButton = ({
  otherPersonalId,
  otherUserName,
  otherProfileImageUrl,
}: DmButtonProps) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const newRoom = await postRoom(otherPersonalId);
      navigate(`/message/${newRoom.chatRoomId}`, {
        state: {
          chatRoomId: newRoom.chatRoomId,
          otherUserName,
          otherProfileImageUrl,
          otherPersonalId,
        },
      });
    } catch (error) {
      console.error('채팅방 생성 실패', error);
    }
  };
  return (
    <div>
      <button
        onClick={handleClick}
        className="flex items-center justify-center w-5 h-5 bg-white rounded-[4rem] border border-solid border-black shadow-[1px_1px_0px_000000] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
      >
        <img src={DmIcon} alt="dm icon" className="w-3 h-3" />
      </button>
    </div>
  );
};
