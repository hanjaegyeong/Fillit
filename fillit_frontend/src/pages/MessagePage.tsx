import Header from '@/components/common/Header/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import ProfileImage from '@/mocks/images/profile-image.png';
import AiFilButton from '@/components/common/Button/AiFilButton';

import { getMessages, postMessage } from '@/api/message';
import { Message as ApiMessage } from '@/types/message';
import { connectRoom, sendMessage } from '@/api/webSocket';
import { MessageType } from '@/enum/MessageType';
import { WebSocketResponse } from '@/types/websocket';

const MessagePage = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const chatRoomId = Number(chatId);
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // WebSocket 연결 및 실시간 메시지 수신 설정
  useEffect(() => {
    if (!chatRoomId) return;
    const ws = connectRoom(chatRoomId);

    const messageListener = (event: MessageEvent) => {
      try {
        const data: WebSocketResponse = JSON.parse(event.data);
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
        console.error('MessagePage messageListener 에러 : ', error);
      }
    };

    ws.addEventListener('message', messageListener);

    return () => {
      ws.removeEventListener('message', messageListener);
      // 필요 시 연결 종료: ws.close();
    };
  }, [chatRoomId]);

  // 초기 메시지 불러오기 (페이지 로드 시 API 호출)
  useEffect(() => {
    if (!chatRoomId) return;
    getMessages(chatRoomId, 0)
      .then((response) => {
        setMessages(response.messages);
      })
      .catch((error) => console.error('MessagePage 메세지 패치 에러 :', error));
  }, [chatRoomId]);

  // 스크롤 자동 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 메시지 전송 처리 (WebSocket으로 전송하며, API 호출은 선택 사항)
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    const newMsgPayload = {
      chatRoomId,
      messageContent: inputMessage,
      type: MessageType.TEXT,
    };
    // WebSocket 전송
    sendMessage(chatRoomId, newMsgPayload);
    // (옵션) API를 통해 메시지 저장: postMessage(newMsgPayload)
    // 옵티미스틱 업데이트: 새로운 메시지를 바로 표시
    const newMessage: ApiMessage = {
      id: messages.length + 1, // 실제 id는 서버에서 부여됨
      userName: 'me',
      personalId: 'my-personal-id', // 실제 사용자의 ID 적용
      messageContent: inputMessage,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');
  };

  // // 연속 메세지 확인
  // const isFirstMessage = (index: number) => {
  //   if (index === 0) return true;
  //   return messages[index].sender !== messages[index - 1].sender;
  // };

  // // 메세지 전송
  // const sendMessage = () => {
  //   if (!inputMessage.trim()) return;
  //   const newMessage: Message = {
  //     id: messages.length + 1,
  //     sender: 'me',
  //     content: inputMessage,
  //     timestamp: new Date().toLocaleTimeString([], {
  //       hour: '2-digit',
  //       minute: '2-digit',
  //     }),
  //   };
  //   setMessages((prevMessages) => [...prevMessages, newMessage]);
  //   setInputMessage('');
  // };

  return (
    <div className="container-header flex flex-col min-h-screen">
      <Header left="back" text={`Chat Room ${chatRoomId}`} isTitle={true} />
      <div>
        <div className="flex-grow overflow-y-auto p-4 space-y-4 h-[calc(100vh-250px)] hide-scrollbar">
          {/* 프로필 */}
          <div className="flex flex-col items-center justify-start pt-8 pb-4">
            <img
              src={ProfileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full"
            />
            <button
              onClick={() => navigate('/profile')}
              className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-lg"
            >
              View Profile
            </button>
          </div>

          {/* 메세지 */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.userName === 'me' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.userName !== 'me' && (
                <img
                  src={ProfileImage}
                  alt={msg.userName}
                  onClick={() => navigate('/profile')}
                  className="w-8 h-8 rounded-full mr-2 self-end"
                />
              )}
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  msg.userName === 'me'
                    ? 'bg-white/60 text-black font-light'
                    : 'bg-white/60 text-black font-light'
                }`}
              >
                <p className="text-sm">{msg.messageContent}</p>
                <span className="block text-xs text-gray-500 text-right mt-1">
                  {msg.createdAt}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <AiFilButton />
        {/* 메세지 입력 */}
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
