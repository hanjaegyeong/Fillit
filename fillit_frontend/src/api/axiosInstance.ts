import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  // 콘솔로 확인할 부분, 필요하다면 삭제
  console.log(
    `[API 요청] ${config.method?.toUpperCase()} ${config.url}`,
    config.data ? config.data : ''
  );
  //////
  return config;
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 콘솔 확인 부분분
    console.log(
      `[API 응답] ${response.status} ${response.config.url}`,
      response.data
    );
    ///////
    return response;
  },
  async (error) => {
    // 콘솔 추가 부분 '[API Response Error]', 이후 제거거
    console.error('[API 응답 오류]', error);

    throw error;
  }
);

export default axiosInstance;
