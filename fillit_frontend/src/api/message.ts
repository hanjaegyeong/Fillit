import axiosInstance from './axiosInstance';
import { Message, MessagePostForm } from '@/types/message';

export const postMessage = async (
  messagePostForm: MessagePostForm
): Promise<Message> => {
  const response = await axiosInstance.post(
    '/api/chat/messages',
    messagePostForm
  );
  return response.data;
};
