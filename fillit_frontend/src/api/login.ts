import axiosInstance from '@/api/axiosInstance';

/* 일반 로그인 */
export const postLogin = async (
  emailOrPersonalId: string,
  password: string
) => {
  const response = await axiosInstance.post('/api/users/login', {
    emailOrPersonalId,
    password,
  });

  const accessToken = response.data.accessToken;

  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  }

  return response.data;
};

/* 로그아웃 */
export const getLogout = async () => {
  const response = await axiosInstance.post('/api/users/logout');

  localStorage.removeItem('accessToken');

  return response.data;
};
