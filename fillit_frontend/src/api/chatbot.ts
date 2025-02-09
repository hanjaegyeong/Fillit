import axiosInstance from './axiosInstance';

/* 챗봇 답장 생성 */
export const postChatbot = async (message: string) => {
  const response = await axiosInstance.post('/api/chatbot', { message });
  return response.data;
};
