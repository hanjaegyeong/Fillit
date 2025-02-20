import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header/Header';
import SearchInput from '@/components/common/Input/SubmitInput';
import ProfileImage from '@/components/common/ProfileImage';
import { NewMessage } from '@/assets/assets';
import { truncateText } from '@/utils/truncateText';
import { getRooms, getSearchRooms } from '@/api/message';
import { ChatRoom } from '@/types/message';
import { formatChatTime } from '@/utils/formatChatTime';
import LoadingSpinner from '@/components/common/Loading/LoadingSpinner';

const MessageListPage = () => {
  const [chatResults, setChatResults] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // 초기 대화방 목록 API 호출
  useEffect(() => {
    setLoading(true);
    getRooms()
      .then((rooms) => setChatResults(rooms))
      .catch((error) => console.error('채팅방들 목록 반환 에러 :', error))
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
      .catch((error) => console.error('채팅방 검색 에러 :', error));
  };

  const handleChatClick = (chatRoomId: number) => {
    navigate(`/message/${chatRoomId}`);
  };

  return (
    <div className="container-header-nav relative flex flex-col min-h-screen items-center">
      <Header left="home" right="notification" />

      <div className="p-6 flex justify-center">
        <div className="hidden">
          <SearchInput
            type="search"
            placeholder="search"
            onSubmit={handleSearch}
          />
        </div>

        <div className="font-light text-xl">Who’s Talking? 💬</div>
      </div>

      <div className="max-w-[21.25rem] w-full px-3 overflow-y-auto max-h-[calc(100dvh-250px)] hide-scrollbar space-y-3.5">
        {loading ? (
          <div className="h-20 pt-8">
            <LoadingSpinner />
          </div>
        ) : chatResults.length === 0 ? (
          <div className="h-[35rem] flex items-center justify-center">
            <p className="text-2xl text-gray-600">No chat rooms found.</p>
          </div>
        ) : (
          chatResults.map((chat) => (
            <div
              key={chat.chatRoomId}
              className="px-3 py-4 bg-white rounded-[20px] shadow flex justify-between cursor-pointer"
              onClick={() => handleChatClick(chat.chatRoomId)}
            >
              <div className="flex items-center">
                <div className="mr-3 flex items-center">
                  <ProfileImage src={chat.profileImageUrl} size={42} />
                </div>
                <div>
                  <p className="text-base font-medium">{chat.otherUser}</p>
                  <p className="text-sm font-extralight text-gray-600">
                    {truncateText(chat.lastMessageContent, 20)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-between whitespace-nowrap -my-1 pr-1">
                <p className="font-light text-xs tracking-tight">
                  {formatChatTime(chat.lastMessageTime)}
                </p>
                {chat.unreadMessageCount > 0 && (
                  <div className="flex justify-end">
                    <p className="w-[1.2rem] h-[1.2rem] flex text-sm items-center justify-center text-white bg-[#0078FF] rounded-full">
                      {chat.unreadMessageCount > 99
                        ? 99
                        : chat.unreadMessageCount}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="w-full max-w-[600px] flex justify-end px-4 fixed bottom-28">
        <button
          onClick={() => navigate('/newmessage')}
          className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md border border-[#D68DE1]"
        >
          <img
            src={NewMessage}
            alt="message-icon"
            className="w-10 h-10 object-contain pt-1"
          />
        </button>
      </div>
    </div>
  );
};

export default MessageListPage;
