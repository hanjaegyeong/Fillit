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
    // 팔로잉(팔로우하는 사람) 목록
    getFolloweeList(currentPersonalId)
      .then((users) => {
        setFollowees(users);
        setFilteredFollowees(users);
      })
      .catch((error) => console.error('팔로잉 목록 반환 에러 :', error));
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
      const newRoom = await postRoom(user.personalId);
      const roomInfo = await getRoomsInfo(newRoom.chatRoomId);
      navigate(`/message/${newRoom.chatRoomId}`, { state: roomInfo });
    } catch (error) {
      console.error('채팅방 생성 에러 :', error);
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
        {filteredFollowees.map((user, index) => {
          const key =
            user.id !== null && user.id !== undefined
              ? user.id
              : `temp-${index}`;
          return (
            <div
              key={key}
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
          );
        })}
      </div>
    </div>
  );
};

export default NewMessagePage;
