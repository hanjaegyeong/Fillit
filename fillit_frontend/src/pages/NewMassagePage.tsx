import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header/Header';
import ProfileImage from '@/mocks/images/profile-image.png';
import SubmitInput from '@/components/common/Input/SubmitInput';
import { postRoom, getRoomsInfo } from '@/api/message';
import { User } from '@/types/user';
import { getFolloweeList } from '@/api/follow';

const NewMessagePage = () => {
  const [followees, setFollowees] = useState<User[]>([]);
  const [filteredFollowees, setFilteredFollowees] = useState<User[]>([]);
  const navigate = useNavigate();

  // 현재 로그인한 사용자의 personalId (예: localStorage에 저장되어 있다고 가정)
  const userInfoStr = localStorage.getItem('user-info');
  const currentPersonalId = userInfoStr
    ? JSON.parse(userInfoStr).state.user.personalId
    : '';

  useEffect(() => {
    // 팔로잉(팔로우하는 사람) 목록을 API로부터 불러옵니다.
    getFolloweeList(currentPersonalId)
      .then((users) => {
        // API 반환 형식: List{ personalId, profileImageUrl, isFollow }
        // isFollow는 여기서 사용하지 않으므로, User 타입과 호환되도록 필요한 필드만 사용합니다.
        setFollowees(users);
        setFilteredFollowees(users);
      })
      .catch((error) => console.error('Error fetching followees:', error));
  }, [currentPersonalId]);

  const handleSearch = (term: string) => {
    const searchTerm = term.toLowerCase().trim();
    if (searchTerm === '') {
      setFilteredFollowees(followees);
      return;
    }
    const filtered = followees.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.personalId.toLowerCase().includes(searchTerm)
    );
    setFilteredFollowees(filtered);
  };

  const handleUserClick = async (user: User) => {
    try {
      // 채팅방 생성/입장 API 호출: 선택한 사용자의 personalId를 otherPersonalId로 전달
      const newRoom = await postRoom(user.personalId);
      console.log('새 채팅방 생성:', newRoom);
      // 2. 채팅방 기본정보 받아오기
      const roomInfo = await getRoomsInfo(newRoom.chatRoomId);
      console.log('채팅방 기본정보(getRoomsInfo):', roomInfo);
      // 생성된 채팅방의 chatRoomId를 사용하여 MessagePage로 이동
      navigate(`/message/${newRoom.chatRoomId}`, { state: roomInfo });
    } catch (error) {
      console.error('Error creating chat room:', error);
    }
  };

  return (
    <div className="container-header bg-none">
      <Header left="back" text="New Message" isTitle={true} />
      <div className="p-4 flex flex-col justify-center items-center">
        <SubmitInput
          type="search"
          onSubmit={handleSearch}
          placeholder="Search"
        />
      </div>
      <div className="w-full px-4 overflow-y-auto max-h-[calc(100vh-220px)] hide-scrollbar">
        {filteredFollowees.map((user) => (
          <div
            key={user.id}
            className="p-4 bg-white flex "
            onClick={() => handleUserClick(user)}
          >
            <img
              src={user.profileImageUrl || ProfileImage}
              alt={user.personalId}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div className="flex flex-col justify-center">
              <p className="text-m font-bold text-gray-600">{user.name}</p>
              <p className="text-xs text-gray-500">{user.personalId}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewMessagePage;
