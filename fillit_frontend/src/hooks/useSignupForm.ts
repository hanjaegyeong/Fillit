import { useState, useEffect, useCallback } from 'react';
import { SignupState, SignupForm } from '@/types/signup';
import { postEmailCheck, postPersonalIdCheck, postSignUp } from '@/api/signup';
import { postInterest } from '@/api/interest';
import axios from 'axios';
import { validationRules } from '@/constants/validationRules';

// 타이머 ID 관리용
let timeoutId: NodeJS.Timeout | null = null;

// 디바운싱 훅
const useDebouncedValue = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [value, delay]);

  return debouncedValue;
};

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
  const [validationStatus, setValidationStatus] = useState({
    personalId: false,
    email: false,
  });

  // 디바운싱된 아이디와 이메일 값
  const debouncedPersonalId = useDebouncedValue(
    signupState.regist.personalId,
    300
  );
  const debouncedEmail = useDebouncedValue(signupState.regist.email, 300);

  // 입력값 변경 핸들러
  const handleInputChange = (
    field: keyof SignupState['regist'],
    value: string | Date | string[]
  ) => {
    if (field === 'personalId' || field === 'email') {
      setValidationStatus((prev) => ({
        ...prev,
        [field]: false,
      }));
    }

    setSignupState((prev) => ({
      ...prev,
      regist: {
        ...prev.regist,
        [field]: value,
      },
    }));
  };

  // 아이디 중복 검사 함수
  const handlePersonalIdCheck = useCallback(async (personalId: string) => {
    try {
      await postPersonalIdCheck(personalId);
      setErrors((prev) => ({
        ...prev,
        personalId: '',
      }));
      setValidationStatus((prev) => ({
        ...prev,
        personalId: true,
      }));
    } catch (error) {
      setValidationStatus((prev) => ({
        ...prev,
        personalId: false,
      }));
      handleError(error, 'personalId');
    }
  }, []);

  // 이메일 중복 검사 함수
  const handleEmailCheck = useCallback(async (email: string) => {
    // 이메일 형식 검증
    const emailRule = validationRules.email.pattern;
    if (!emailRule || !emailRule.value.test(email)) {
      setValidationStatus((prev) => ({
        ...prev,
        email: false,
      }));
      return;
    }

    try {
      await postEmailCheck(email);
      setErrors((prev) => ({
        ...prev,
        email: '',
      }));
      setValidationStatus((prev) => ({
        ...prev,
        email: true,
      }));
    } catch (error) {
      setValidationStatus((prev) => ({
        ...prev,
        email: false,
      }));
      handleError(error, 'email');
    }
  }, []);

  // 공통 에러 처리
  const handleError = (error: unknown, field: string) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 409) {
        setErrors((prev) => ({
          ...prev,
          [field]: `이미 등록된 ${
            field === 'personalId' ? '아이디' : '이메일'
          }입니다.`,
        }));
      } else {
        console.error(`${field} 중복 체크 실패:`, error);
      }
    } else {
      console.error(`${field} 중복 체크 실패:`, error);
    }
  };

  // useEffect를 사용해 디바운싱된 값에 따라 중복 검사를 호출
  useEffect(() => {
    if (debouncedPersonalId) {
      handlePersonalIdCheck(debouncedPersonalId);
    }
  }, [debouncedPersonalId, handlePersonalIdCheck]);

  useEffect(() => {
    if (debouncedEmail) {
      handleEmailCheck(debouncedEmail);
    }
  }, [debouncedEmail, handleEmailCheck]);

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
    handleSignup,
    handleInterestSubmit,
    setErrors,
    setIsLoading,
    validationStatus,
  };
};
