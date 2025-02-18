import axiosInstance from './axiosInstance';

/* 사용자 알림 조회 */
export const getNotification = async (
  size: number,
  cursorId: number | null
) => {
  const response = await axiosInstance.get('/api/notification', {
    params: { size, cursorId },
  });
  return response.data;
};

/* 알림 읽음 처리 */
export const postNotification = async (notificationId: number) => {
  const response = await axiosInstance.post(
    `/api/notification/${notificationId}/read`
  );
  return response.data;
};
