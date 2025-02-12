import axiosInstance from './axiosInstance';
import { Message, MessageListResponse, MessagePostForm } from '@/types/message';

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
