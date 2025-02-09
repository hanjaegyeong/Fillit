import axiosInstance from '@/api/axiosInstance';
import type { SignupForm } from '@/types/signup';

/* 일반 회원가입 */
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
