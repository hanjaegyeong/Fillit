import { useState } from 'react';
import { SignupState, SignupForm } from '@/types/signup';
import { postEmailCheck, postPersonalIdCheck, postSignUp } from '@/api/signup';
import { postInterest } from '@/api/interest';
import axios from 'axios';

export const useSignupForm = (
  setStep: (value: React.SetStateAction<number>) => void
) => {
  const [signupState, setSignupState] = useState<SignupState>({
    regist: {
      type: 'user',
      password: '',
      passwordConfirm: '',
      name: '',
      personalId: '',
      birthDate: new Date(),
      email: '',
      introduction: '',
      interest: [],
    },
    profileImage: undefined,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // 입력값 변경 핸들러
  const handleInputChange = (
    field: keyof SignupState['regist'],
    value: string | Date | string[]
  ) => {
    setSignupState((prev) => ({
      ...prev,
      regist: {
        ...prev.regist,
        [field]: value,
      },
    }));
  };

  // 회원가입 API 호출
  const handleSignup = async () => {
    try {
      setIsLoading(true);
      console.log('Submitting signup form:', signupState);

      // SignupForm 형식에 맞게 데이터 변환
      const signupForm: SignupForm = {
        regist: {
          type: 'user',
          password: signupState.regist.password,
          name: signupState.regist.name,
          personalId: signupState.regist.personalId,
          birthDate: signupState.regist.birthDate,
          email: signupState.regist.email,
          introduction: signupState.regist.introduction,
        },
        profileImage: signupState.profileImage,
      };

      const response = await postSignUp(signupForm);
      console.log('Signup success:', response);

      // 다음 단계(관심사 입력)로 이동
      setStep((prev) => prev + 1);
    } catch (error) {
      console.error('Signup failed:', error);
      // 에러 처리 (예: 알림 표시)
    } finally {
      setIsLoading(false);
    }
  };
  // 아이디 중복  체크 핸들러
  const handlePersonalIdBlur = async () => {
    try {
      await postPersonalIdCheck(signupState.regist.personalId);
      setErrors((prev) => ({
        ...prev,
        personalId: '',
      }));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          // 409 에러인 경우, 이미 등록된 아이디라는 에러 메시지만 업데이트하고 콘솔에는 출력하지 않음
          setErrors((prev) => ({
            ...prev,
            personalId: '이미 등록된 아이디입니다.',
          }));
        } else {
          console.error('아이디 중복 체크 실패:', error);
        }
      } else {
        console.error('아이디 중복 체크 실패:', error);
      }
    }
  };

  // 이메일 중복 체크 핸들러
  const handleEmailBlur = async () => {
    try {
      await postEmailCheck(signupState.regist.email);
      setErrors((prev) => ({
        ...prev,
        email: '',
      }));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          // 409 에러인 경우 이미 등록된 이메일이라는 메세지만 업데이트
          setErrors((prev) => ({
            ...prev,
            email: '이미 등록된 이메일입니다.',
          }));
        } else {
          // 그 외 에러는 콘솔에 출력
          console.error('이메일 중복 체크 실패:', error);
        }
      } else {
        console.error('이메일 중복 체크 실패:', error);
      }
    }
  };

  const handlePasswordConfirmBlur = async () => {
    const passwordConfirmValue = signupState.regist.passwordConfirm;
    if (passwordConfirmValue !== signupState.regist.password) {
      setErrors((prev) => ({
        ...prev,
        passwordConfirm: '비밀번호가 일치하지 않습니다',
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        passwordConfirm: '',
      }));
    }
  };

  // 관심사 등록 API 호출
  const handleInterestSubmit = async () => {
    try {
      setIsLoading(true);
      console.log('Submitting interests:', signupState.regist.interest);

      await postInterest(
        signupState.regist.personalId,
        signupState.regist.interest
      );
      console.log('Interest submission success');

      // 최종 완료 단계로 이동
      setStep((prev) => prev + 1);
    } catch (error) {
      console.error('Interest submission failed:', error);
      // 에러 처리
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signupState,
    setSignupState,
    errors,
    isLoading,
    handleInputChange,
    handleEmailBlur,
    handlePersonalIdBlur,
    handlePasswordConfirmBlur,
    handleInterestSubmit,
    handleSignup,
    setErrors,
    setIsLoading,
  };
};
