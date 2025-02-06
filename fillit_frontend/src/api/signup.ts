import axiosInstance from '@/api/axiosInstance';
import type { SignupForm } from '@/types/signup';

// 일반 회원가입
export const postSignUp = async (signupForm: SignupForm) => {
  const formData = new FormData();

  formData.append(
    'regist',
    new Blob([JSON.stringify(signupForm.regist)], { type: 'application/json' })
  );

  if (signupForm.profileImage) {
    formData.append('profileImage', signupForm.profileImage);
  }

  const response = await axiosInstance.post('/api/users/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
