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

/* 유저 관심사 조회 */
export const getInterest = async () => {
  const response = await axiosInstance.get('/api/interests/user');
  return response.data;
};

/* 관심사 리스트 조회 */
export const getInterestList = async () => {
  const response = await axiosInstance.get('/api/interests');
  return response.data;
};
