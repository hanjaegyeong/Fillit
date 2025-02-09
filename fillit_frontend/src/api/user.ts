import axiosInstance from '@/api/axiosInstance';
import { User, UserUpdateForm } from '@/types/user';

/* 프로필 조회 */
export const getUserProfile = async (personalId: string): Promise<User> => {
  const response = await axiosInstance.get(`/api/users/${personalId}`);
  return response.data;
};

/* 프로필 수정 */
export const patchUserProfile = async (userUpdateForm: UserUpdateForm) => {
  const formData = new FormData();
  formData.append(
    'update',
    new Blob([JSON.stringify(userUpdateForm.update)], {
      type: 'application/json',
    })
  );
  if (userUpdateForm.profileImage) {
    formData.append('profileImage', userUpdateForm.profileImage);
  }

  const response = await axiosInstance.patch('/api/users/update', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
