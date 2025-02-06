import axiosInstance from '@/api/axiosInstance';

// 일반 로그인
export const postLogin = async (email: string, password: string) => {
  const response = await axiosInstance.post('/api/users/login', {
    email,
    password,
  });
  return response.data;
};
