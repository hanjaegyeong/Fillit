import axiosInstance from './axiosInstance';
import {
  ChatRoom,
  Message,
  MessageListResponse,
  MessagePostForm,
} from '@/types/message';

export const postMessage = async (
  messagePostForm: MessagePostForm
): Promise<Message> => {
  const response = await axiosInstance.post(
    '/api/chat/messages',
    messagePostForm
  );
  return response.data;
};

export const getMessage = async (
  chatRoomId: number,
  cursor: number
): Promise<MessageListResponse> => {
  const response = await axiosInstance.get('/api/chat/rooms/messages', {
    params: {
      chatRoomId,
      cursor,
    },
  });
  return response.data;
};

export const postRoom = async (otherPersonalId: string): Promise<ChatRoom> => {
  if (process.env.NODE_ENV === 'development') {
    return Promise.resolve({
      chatRoomId: 1,
      otherUser: 'tset',
      profileImageUrl: 'test',
      lastMessageContent: 'test',
      lastMessageTime: new Date().toISOString(),
      unreadMessageCount: 3,
    });
  }

  const response = await axiosInstance.post('/api/chat/rooms/messages', {
    params: otherPersonalId,
  });
  return response.data;
};
