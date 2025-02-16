import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken } from '@/api/auth';
import { logError, logRequest, logResponse } from '@/utils/logApi';

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

  if (accessToken !== null) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  logRequest(config.url || '', config.method || '', config.data || '');

  return config;
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    logResponse(response.config.url || '', response.status, response.data);

    return response;
  },
  async (error) => {
    const status = error?.response?.status;
    const errorMessage = error?.response?.data;

    logError(status, errorMessage || '');

    if (status === 401 && errorMessage === 'Access token expired') {
      try {
        const accessToken = await getAccessToken();

        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
        }
      } catch (error) {
        window.location.replace('/login');
      }
    }

    throw error;
  }
);

export default axiosInstance;
