import Header from '@/components/common/Header/Header';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import ProfileImage from '@/mocks/images/profile-image.png';
import AiFilButton from '@/components/common/Button/AiFilButton';

import { getMessages, getRoomsInfo } from '@/api/message';
import { Message as ApiMessage, ChatRoomInfo } from '@/types/message';
import { connectRoom, sendMessage } from '@/api/webSocket';
import { MessageType } from '@/enum/MessageType';
import { WebSocketResponse } from '@/types/websocket';

const MessagePage = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const location = useLocation();
  const chatRoomId = Number(chatId);
  console.log('chatRoomId:', chatRoomId, 'location.state:', location.state);

  if (isNaN(chatRoomId)) {
    return <div>Error: Invalid chat room ID.</div>;
  }

  // 현재 로그인한 사용자의 personalId 추출 ("user-info"에 저장된 정보 사용)
  const userInfoStr = localStorage.getItem('user-info');
  const currentUserPersonalId = userInfoStr
    ? JSON.parse(userInfoStr).state.user.personalId
    : '';

  // 라우터 state로 채팅방 기본정보가 전달되었는지 확인
  const [roomInfo, setRoomInfo] = useState<ChatRoomInfo | null>(
    (location.state as ChatRoomInfo) || null
  );
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 채팅방 기본정보가 없다면 getRoomsInfo API 호출
  useEffect(() => {
    console.log('useEffect getRoomsInfo 시작, roomInfo:', roomInfo);
    if (!roomInfo) {
      console.log(`getRoomsInfo 호출: chatRoomId=${chatRoomId}`);
      getRoomsInfo(chatRoomId)
        .then((info) => {
          console.log('getRoomsInfo 응답:', info);
          setRoomInfo(info);
        })
        .catch((error) =>
          console.error('Error fetching room info in MessagePage:', error)
        );
    } else {
      console.log('라우터 state에서 roomInfo 받음:', roomInfo);
    }
  }, [chatRoomId, roomInfo]);

  // WebSocket 연결 및 실시간 메시지 수신 (roomInfo가 확보된 후)
  useEffect(() => {
    if (!chatRoomId || !roomInfo) {
      console.log('WebSocket 연결 대기: chatRoomId 또는 roomInfo 없음');
      return;
    }
    console.log('WebSocket 연결 시도: chatRoomId=', chatRoomId);
    const ws = connectRoom(chatRoomId);

    ws.addEventListener('open', () => {
      console.log(`WebSocket 연결(${chatRoomId})이 OPEN 상태입니다.`);
    });

    const messageListener = (event: MessageEvent) => {
      try {
        const data: WebSocketResponse = JSON.parse(event.data);
        console.log('WebSocket 메시지 수신:', data);
        setMessages((prev) => [
          ...prev,
          {
            id: data.id,
            userName: data.userName,
            personalId: data.personalId,
            messageContent: data.messageContent,
            createdAt: data.createdAt,
          },
        ]);
      } catch (error) {
        console.error('MessagePage messageListener error:', error);
      }
    };

    ws.addEventListener('message', messageListener);

    return () => {
      ws.removeEventListener('message', messageListener);
      // 필요 시 ws.close();
    };
  }, [chatRoomId, roomInfo]);

  // 초기 메시지 불러오기 (HTTP API 호출)
  useEffect(() => {
    if (!chatRoomId) return;
    console.log('getMessages 호출:', chatRoomId, 'cursor=0');
    getMessages(chatRoomId, 0)
      .then((response) => {
        console.log('getMessages 응답:', response);
        setMessages(response.messages);
      })
      .catch((error) =>
        console.error('MessagePage error fetching messages:', error)
      );
  }, [chatRoomId]);

  // 스크롤 자동 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 메시지 전송 처리 (WebSocket을 통한 전송)
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    const newMsgPayload = {
      chatRoomId,
      messageContent: inputMessage,
      type: MessageType.TEXT,
    };
    // WebSocket 전송
    sendMessage(chatRoomId, newMsgPayload);
    // 옵티미스틱 업데이트: 로컬 상태에 새 메시지 추가
    const newMessage: ApiMessage = {
      id: messages.length + 1, // 실제 id는 서버에서 부여됨
      userName: currentUserPersonalId, // 실제 사용자 이름으로 대체 (원하는 경우)
      personalId: currentUserPersonalId,
      messageContent: inputMessage,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');
  };

  return (
    <div className="container-header flex flex-col min-h-screen">
      <Header left="back" text={`Chat Room ${chatRoomId}`} isTitle={true} />
      <div>
        <div className="flex-grow overflow-y-auto p-4 space-y-4 h-[calc(100vh-250px)] hide-scrollbar">
          {/* 채팅방 기본정보(상대방 정보) 표시 */}
          <div className="flex flex-col items-center justify-start pt-8 pb-4">
            <img
              src={roomInfo?.otherProfileImageUrl || ProfileImage}
              alt={roomInfo?.otherUserName || 'Profile'}
              className="w-24 h-24 rounded-full"
            />
            {/* View Profile 버튼: 상대방 personalId 사용 */}
            <button
              onClick={() => navigate(`/profile/${roomInfo?.otherPersonalId}`)}
              className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-lg"
            >
              View Profile
            </button>
          </div>
          {/* 메시지 목록 */}
          {messages.map((msg) => {
            // 현재 사용자의 메시지인지 판단 (현재 사용자의 personalId와 비교)
            const isMyMessage = msg.personalId === currentUserPersonalId;
            return (
              <div
                key={msg.id}
                className={`flex ${
                  isMyMessage ? 'justify-end' : 'justify-start'
                }`}
              >
                {!isMyMessage && (
                  <img
                    src={roomInfo?.otherProfileImageUrl || ProfileImage}
                    alt={msg.userName}
                    onClick={() =>
                      navigate(`/profile/${roomInfo?.otherPersonalId}`)
                    }
                    className="w-8 h-8 rounded-full mr-2 self-end cursor-pointer"
                  />
                )}
                <div className="max-w-[70%] p-3 rounded-lg bg-white/60 text-black font-light">
                  <p className="text-sm">{msg.messageContent}</p>
                  <span className="block text-xs text-gray-500 text-right mt-1">
                    {msg.createdAt}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <AiFilButton />
        {/* 메시지 입력 영역 */}
        <div className="p-6 flex items-center border-t border-gray-300">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-grow p-3 border rounded-lg focus:outline-none"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="ml-3 bg-blue-500 text-white p-3 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
