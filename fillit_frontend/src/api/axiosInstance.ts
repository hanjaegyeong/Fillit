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
  return config;
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    // console.error(error);

    throw error;
  }
);

export default axiosInstance;
