import axiosInstance from '@/api/axiosInstance';
import { Voice, VoiceReply } from '@/types/voice';

/* 내 보이스 업로드 */
export const postVoice = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  // 데이터 확인을 위해 추가한 부분
  for (const [key, value] of formData.entries()) {
    console.log(`[postVoice] FormData entry: ${key}`, value);
  }
  ///////

  const response = await axiosInstance.post('/api/voice/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/* 내 보이스 듣기 */
export const getVoice = async () => {
  const response = await axiosInstance.get('/api/voice/listen');
  return response.data;
};

/* 내 보이스 삭제 */
export const deleteVoice = async (voiceId: number) => {
  const response = await axiosInstance.delete(`/api/voice/${voiceId}`);
  return response.data;
};

/* 팔로위 보이스 리스트 조회 */
export const getFolloweeVoiceList = async (): Promise<Voice[]> => {
  const response = await axiosInstance.get('/api/voice/list');
  return response.data;
};

/* 보이스 답장 업로드 */
export const postVoiceReply = async (file: File, voiceId: number) => {
  const formData = new FormData();

  formData.append('file', file);
  formData.append('voiceId', voiceId.toString());

  const response = await axiosInstance.post(
    '/api/voice/reply/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};

/* 보이스 답장 듣기 */
export const getVoiceReply = async (
  voiceReplyId: number
): Promise<VoiceReply> => {
  const response = await axiosInstance.get(
    `/api/voice/reply/listen/${voiceReplyId}`
  );
  return response.data;
};

/* 보이스 답장 조회 */
export const getVoiceReplyList = async (): Promise<VoiceReply[]> => {
  const response = await axiosInstance.get('/api/voice/reply');
  return response.data;
};

/* 보이스 답장 삭제 */
export const deleteVoiceReply = async (voiceReplyId: number) => {
  const response = await axiosInstance.delete(
    `/api/voice/reply/${voiceReplyId}`
  );
  return response.data;
};
