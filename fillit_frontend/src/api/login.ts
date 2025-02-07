import axiosInstance from '@/api/axiosInstance';

/* 일반 로그인 */
export const postLogin = async (email: string, password: string) => {
  const response = await axiosInstance.post('/api/users/login', {
    email,
    password,
  });
  return response.data;
};

/* 중복 이메일 체크 */
export const postEmailCheck = async (input: string) => {
  const response = await axiosInstance.post('/api/users/duplicate/email', {
    input,
  });
  return response.data;
};

/* 중복 personalId 체크 */
export const postPersonalIdCheck = async (input: string) => {
  const response = await axiosInstance.post('/api/users/duplicate/nickname', {
    input,
  });
  return response.data;
};
