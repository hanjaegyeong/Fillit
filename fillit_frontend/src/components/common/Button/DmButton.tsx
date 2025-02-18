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
      <button onClick={handleClick}>
        <img src={DmIcon} alt="dm icon" className="pt-1.5" />
      </button>
    </div>
  );
};
