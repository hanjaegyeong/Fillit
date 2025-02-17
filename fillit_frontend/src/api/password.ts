import axiosInstance from './axiosInstance';

/* 이메일 인증 코드 전송 */
export const postEmailCode = async (email: string, personalId: string) => {
  try {
    const response = await axiosInstance.post('/api/users/email/send', {
      email,
      personalId,
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error('인증에 실패했습니다. 입력하신 정보를 확인해주세요.');
    }
    if (error.message?.includes('Failed to send email')) {
      throw new Error('이메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
    throw error;
  }
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
