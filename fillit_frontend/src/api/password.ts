import axiosInstance from './axiosInstance';

/* 이메일 인증 코드 전송 */
export const postEmailCode = async (email: string, personalId: string) => {
  const response = await axiosInstance.post('/api/users/email/send', {
    email,
    personalId,
  });
  return response.data;
};

/* 이메일 인증 코드 확인 */
export const postVerifyEmailCode = async (email: string, code: string) => {
  const response = await axiosInstance.post('/api/users/email/verify', {
    email,
    code,
  });
  return response.data;
};

/* 비밀번호 변경 */
export const patchPassword = async (email: string, password: string) => {
  const response = await axiosInstance.patch('/api/users/password', {
    email,
    password,
  });
  return response.data;
};
