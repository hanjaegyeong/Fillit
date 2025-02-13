import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header/Header';
import SearchInput from '@/components/common/Input/SubmitInput';
import MockProfileImage from '@/mocks/images/profile-image.png';
import ProfileImage from '@/components/common/ProfileImage';
import { NewMessage } from '@/assets/assets';
import { truncateText } from '@/utils/truncateText';
import { getRooms, getSearchRooms } from '@/api/message';
import { ChatRoom } from '@/types/message';

const MessageListPage = () => {
  const [chatResults, setChatResults] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // 초기 대화방 목록 API 호출
  useEffect(() => {
    setLoading(true);
    getRooms()
      .then((rooms) => setChatResults(rooms))
      .catch((error) => console.error('Error fetching chat rooms:', error))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (term: string) => {
    const searchTerm = term.toLowerCase().trim();
    if (searchTerm === '') {
      getRooms().then((rooms) => setChatResults(rooms));
      return;
    }
    // 임의의 size, cursorId 값 사용 (필요 시 수정)
    getSearchRooms(10, 0, searchTerm)
      .then((rooms) => setChatResults(rooms))
      .catch((error) => console.error('Error searching chat rooms:', error));
  };

  const handleChatClick = (chatRoomId: number) => {
    navigate(`/message/${chatRoomId}`);
  };

  return (
    <div className="container-header-nav relative flex flex-col min-h-screen items-center">
      <Header left="home" right="notification" />

      <div className="p-6 flex justify-center">
        <SearchInput
          type="search"
          placeholder="search"
          onSubmit={handleSearch}
        />
      </div>

      <div className="w-[340px] overflow-y-auto max-h-[calc(100vh-250px)] hide-scrollbar space-y-3.5">
        {loading ? (
          <p>Loading...</p>
        ) : chatResults.length === 0 ? (
          <p>No chat rooms found.</p>
        ) : (
          chatResults.map((chat) => (
            <div
              key={chat.chatRoomId}
              className="px-3 py-4 bg-white rounded-[20px] shadow flex items-center cursor-pointer"
              onClick={() => handleChatClick(chat.chatRoomId)}
            >
              <div className="mr-3">
                <ProfileImage
                  src={chat.profileImageUrl || MockProfileImage}
                  size={42}
                />
              </div>
              <div>
                <p className="text-sm font-medium">{chat.otherUser}</p>
                <p className="text-sm font-extralight text-gray-600">
                  {truncateText(chat.lastMessageContent, 30)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="w-full max-w-[600px] flex justify-end px-4 fixed bottom-32">
        <button
          onClick={() => navigate('/newmessage')}
          className="w-[64px] h-[64px] bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <img
            src={NewMessage}
            alt="New Message"
            className="w-full h-full object-contain"
          />
        </button>
      </div>
    </div>
  );
};

export default MessageListPage;
