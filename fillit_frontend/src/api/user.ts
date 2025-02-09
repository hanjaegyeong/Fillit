import axiosInstance from '@/api/axiosInstance';
import { User } from '@/types/user';

/* 프로필 조회 */
export const getUserProfile = async (personalId: string): Promise<User> => {
  const response = await axiosInstance.get(`/api/users/${personalId}`);
  return response.data;
};
