import axiosInstance from '@/api/axiosInstance';

/* 관심사 추가 */
export const postInterest = async (
  personalId: string,
  interestContents: string[]
) => {
  const response = await axiosInstance.post('/api/interests', {
    personalId,
    interestContents,
  });
  return response.data;
};
