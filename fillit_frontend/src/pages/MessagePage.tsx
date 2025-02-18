import Header from '@/components/common/Header/Header';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import AiFilButton from '@/components/common/Button/AiFilButton';
import { getMessages, getRoomsInfo } from '@/api/message';
import { Message as ApiMessage, ChatRoomInfo } from '@/types/message';
import { connectRoom, sendMessage } from '@/api/webSocket';
import { MessageType } from '@/constants/messageType';
import { WebSocketResponse } from '@/types/websocket';
import ProfileImage from '@/components/common/ProfileImage';
import SubmitInput from '@/components/common/Input/SubmitInput';
import { formatChatTime } from '@/utils/formatChatTime';

const MessagePage = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const location = useLocation();
  const chatRoomId = Number(chatId);

  if (isNaN(chatRoomId)) {
    return <div>Error: Invalid chat room ID.</div>;
  }

  // 현재 로그인한 사용자의 personalId ("user-info"에 저장된 정보 사용)
  const userInfoStr = localStorage.getItem('user-info');
  const currentUserPersonalId = userInfoStr
    ? JSON.parse(userInfoStr).state.user.personalId
    : '';

  const [roomInfo, setRoomInfo] = useState<ChatRoomInfo | null>(
    (location.state as ChatRoomInfo) || null
  );
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 현재 방 정보가 없으면 방 정보 가져오기
  useEffect(() => {
    if (!roomInfo) {
      getRoomsInfo(chatRoomId)
        .then((info) => {
          setRoomInfo(info);
        })
        .catch((error) => {
          console.error('방 정보 가져오기 에러 : ', error);
        });
    } else {
      console.log('라우터 state에서 roomInfo 받음:', roomInfo);
    }
  }, [chatRoomId, roomInfo]);

  // WebSocket 연결 및 실시간 메시지 수신 (roomInfo가 확보된 후)
  useEffect(() => {
    if (!chatRoomId || !roomInfo) return;

    // 현재 사용자의 personalId를 함께 전달
    const ws = connectRoom(chatRoomId, currentUserPersonalId);
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
        console.error('messageListener 에러 : ', error);
      }
    };

    ws.addEventListener('message', messageListener);

    return () => {
      ws.removeEventListener('message', messageListener);
    };
  }, [chatRoomId, roomInfo, currentUserPersonalId]);

  useEffect(() => {
    if (!chatRoomId) return;
    getMessages(chatRoomId, null)
      .then((response) => {
        // 내림차순으로 받아온 메시지를 reverse하여 오름차순으로 표시
        setMessages(response.messages.reverse());
      })
      .catch((error) => console.error('메세지 패치 에러 :', error));
  }, [chatRoomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;
    const newMsgPayload = {
      chatRoomId,
      messageContent: content,
      type: MessageType.TEXT,
    };

    // 현재 사용자의 personalId를 포함하여 sendMessage 호출
    sendMessage(chatRoomId, currentUserPersonalId, newMsgPayload);
  };

  return (
    <div className="container-header">
      <Header left="back" text={roomInfo?.otherUserName} isTitle={true} />
      <div>
        <div className="flex-grow overflow-y-auto space-y-3 hide-scrollbar">
          <div className="flex flex-col items-center justify-start pt-10 pb-4 w-80">
            <ProfileImage
              src={roomInfo?.otherProfileImageUrl}
              alt={roomInfo?.otherUserName}
              size={96}
            />
            <button
              onClick={() => navigate(`/profile/${roomInfo?.otherPersonalId}`)}
              className="bg-black/20 text-white px-4 py-2 mt-4 rounded-lg "
            >
              View Profile
            </button>
          </div>
          {messages.map((msg, index) => {
            const key =
              msg.id !== null && msg.id !== undefined
                ? msg.id
                : `temp-${index}`;
            const isMyMessage = msg.personalId === currentUserPersonalId;
            return (
              <div
                key={key}
                className={`flex ${
                  isMyMessage ? 'justify-end' : 'justify-start'
                }`}
              >
                {!isMyMessage && (
                  <div className="mr-2 self-end">
                    <ProfileImage
                      src={roomInfo?.otherProfileImageUrl}
                      alt={roomInfo?.otherUserName}
                      size={32}
                      personalId={roomInfo?.otherPersonalId}
                    />
                  </div>
                )}
                <div className="max-w-[70%] px-[0.94rem] py-[0.75rem] rounded-lg bg-white/60 text-black font-light">
                  <p className="font-extralight min-w-28 max-w-44 break-words leading-tight">
                    {msg.messageContent}
                  </p>
                  <span className="block text-xs text-gray-500 text-right mt-1 tracking-tight">
                    {formatChatTime(msg.createdAt)}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="px-5 pt-5 pb-8 w-full rounded-t-[1.9rem] bg-white fixed max-w-[600px] bottom-0 flex items-center border-t">
        <AiFilButton />
        <SubmitInput
          placeholder="Type a message..."
          onSubmit={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default MessagePage;
