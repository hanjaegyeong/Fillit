/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useTypingEffect from '@/hooks/useTypingEffect';

import FillitLongLog from '@/assets/icons/fillit-long-logo.svg';
import FilTakeOn from '@/assets/images/fil-takeon.png';

import BasicButton from '@/components/common/Button/BasicButton';
import BasicInput from '@/components/common/Input/BasicInput';
import ImageUpload from '@/components/common/ImageUpload';
import Textarea from '@/components/common/TextArea';
import BirthInput from '@/components/common/Input/BirthInput';
import InterestTags from '@/components/common/InterestTags';
import { steps } from '@/constants/signupSteps';
import { SignupForm, SignupState } from '@/types/signup';
import { postSignUp } from '@/api/signup';
import { postInterest } from '@/api/interest';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: {
    value: RegExp;
    message: string;
  };
  validate?: (value: string, formValues: SignupState) => boolean | string;
}

const validationRules: Record<keyof SignupState['regist'], ValidationRule> = {
  type: { required: true },
  name: {
    required: true,
    maxLength: 8,
    pattern: {
      value: /^[A-Za-z]+$/,
      message: '영어만 입력 가능합니다',
    },
  },
  personalId: {
    required: true,
    minLength: 5,
    maxLength: 20,
    pattern: {
      value: /^[a-z0-9_]+$/,
      message: '소문자, 숫자, 언더스코어만 사용 가능합니다',
    },
  },
  password: {
    required: true,
    minLength: 8,
    maxLength: 16,
    pattern: {
      value: /^[A-Za-z0-9]+$/,
      message: '영문 대/소문자, 숫자만 사용 가능합니다',
    },
  },
  passwordConfirm: {
    required: true,
    validate: (value: string, formValues: SignupState) =>
      value === formValues.regist.password || '비밀번호가 일치하지 않습니다',
  },
  email: {
    required: true,
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: '올바른 이메일 형식이 아닙니다',
    },
  },
  birthDate: { required: true },
  introduction: { required: true },
  interest: { required: true },
};

const SignUpPage = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  // 폼 상태 관리
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

  const [isLoading, setIsLoading] = useState(false);

  // 현재 단계의 필드 이름 반환하는 함수
  const getCurrentField = (): keyof SignupState['regist'] | null => {
    switch (step) {
      case 0:
        return 'name';
      case 1:
        return 'personalId';
      case 2:
        return 'password';
      case 3:
        return 'passwordConfirm';
      case 4:
        return 'email';
      case 5:
      case 6:
        return null; // 프로필 이미지 선택 단계
      case 7:
        return 'birthDate';
      case 8:
        return 'introduction';
      case 9:
        return 'interest';
      default:
        return null;
    }
  };

  // 현재 단계 유효성 검증
  const validateCurrentStep = async () => {
    const currentField = getCurrentField();

    // 이미지 선택 단계는 검증 스킵
    if (step === 5 || step === 6) {
      return true;
    }

    // 마지막 완료 단계는 검증 스킵
    if (step === steps.length - 1) {
      return true;
    }

    if (!currentField) {
      return true;
    }

    // 현재 필드의 값 가져오기
    const currentValue = signupState.regist[currentField];

    // 값이 비어있거나 유효하지 않은 경우
    if (
      !currentValue ||
      (typeof currentValue === 'string' && currentValue.trim() === '')
    ) {
      return false;
    }

    // 현재 필드에 대한 유효성 규칙 가져오기
    const rule = validationRules[currentField];
    if (!rule) return true;

    // 비밀번호 확인 검증
    if (currentField === 'passwordConfirm') {
      if (currentValue !== signupState.regist.password) {
        setErrors((prev) => ({
          ...prev,
          passwordConfirm: '비밀번호가 일치하지 않습니다',
        }));
        return false;
      }
    }

    // 패턴 검사
    if (rule.pattern && typeof currentValue === 'string') {
      if (!rule.pattern.value.test(currentValue)) {
        return false;
      }
    }

    // 길이 검사
    if (typeof currentValue === 'string') {
      if (rule.minLength && currentValue.length < rule.minLength) return false;
      if (rule.maxLength && currentValue.length > rule.maxLength) return false;
    }

    return true;
  };

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

  const handleNext = async () => {
    if (!validateCurrentStep()) return;

    if (step === steps.length - 3) {
      // 회원가입 API 호출
      await handleSignup();
    } else if (step === steps.length - 2) {
      // 관심사 등록 API 호출
      await handleInterestSubmit();
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step === 0) {
      navigate('/login');
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const messages = [
    steps[step].message1,
    steps[step].message2,
    steps[step].message3,
  ];

  const typedMessages = useTypingEffect(messages, step, 30);

  // 현재 필드의 유효성 검사
  const validateField = async (
    field: keyof SignupState['regist'],
    value: string
  ) => {
    const rule = validationRules[field];
    if (!rule) return true;

    let isValid = true;
    let errorMessage = '';

    if (rule.required && !value) {
      isValid = false;
      errorMessage = '필수 입력 항목입니다';
    } else if (rule.minLength && value.length < rule.minLength) {
      isValid = false;
      errorMessage = `최소 ${rule.minLength}자 이상 입력하세요`;
    } else if (rule.maxLength && value.length > rule.maxLength) {
      isValid = false;
      errorMessage = `최대 ${rule.maxLength}자까지 입력 가능합니다`;
    } else if (rule.pattern && !rule.pattern.value.test(value)) {
      isValid = false;
      errorMessage = rule.pattern.message;
    }

    setErrors((prev) => ({
      ...prev,
      [field]: errorMessage,
    }));

    return isValid;
  };

  // 버튼 비활성화 상태를 관리하는 state 추가
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(false);

  // useEffect를 사용하여 각 단계별 유효성 검증 실행
  useEffect(() => {
    const validateStep = async () => {
      const isValid = await validateCurrentStep();
      setIsNextButtonDisabled(!isValid);
      console.log('Button disabled:', !isValid); // 디버깅용 로그
    };
    validateStep();
  }, [step, signupState.regist]);

  return (
    <div className="container-base justify-center">
      <header className="fixed top-0 w-full py-4 px-6 z-10">
        <img src={FillitLongLog} className="h-10" />
      </header>
      <img src={FilTakeOn} alt="fil-takeon-img" className="w-44" />
      {typedMessages.map((msg, index) => (
        <p
          key={index}
          className="inline-block text-center text-white bg-black px-2"
        >
          {msg}
        </p>
      ))}
      <div className="pt-6">
        {steps[step].inputType === 'text' && (
          <div className="w-full">
            <BasicInput
              type={
                getCurrentField() === 'password' ||
                getCurrentField() === 'passwordConfirm'
                  ? 'password'
                  : 'text'
              }
              placeholder={steps[step].placeholder}
              value={
                signupState.regist[
                  getCurrentField() as keyof SignupState['regist']
                ] as string
              }
              onChange={async (e) => {
                const field = getCurrentField() as keyof SignupState['regist'];
                const value = e.target.value;
                handleInputChange(field, value);

                // 비밀번호 확인 필드일 경우 추가 검증
                if (field === 'passwordConfirm') {
                  if (value !== signupState.regist.password) {
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
                }

                await validateField(field, value);
              }}
              className={
                errors[getCurrentField() as string] ? 'border-red-500' : ''
              }
            />
            {errors[getCurrentField() as string] && (
              <p className="text-red-500 text-xs mt-1">
                {errors[getCurrentField() as string]}
              </p>
            )}
          </div>
        )}
        {steps[step].inputType === 'email' && (
          <BasicInput
            placeholder={steps[step].placeholder}
            value={signupState.regist.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        )}
        {steps[step].inputType === 'date' && (
          <BirthInput
            value={signupState.regist.birthDate}
            onChange={(date) => handleInputChange('birthDate', date)}
          />
        )}
        {steps[step].inputType === 'file' && <ImageUpload />}
        {steps[step].inputType === 'textarea' && (
          <Textarea
            value={signupState.regist.introduction}
            onChange={(value) => handleInputChange('introduction', value)}
          />
        )}
        {steps[step].inputType === 'tags' && (
          <InterestTags
            selectedTags={signupState.regist.interest}
            onChange={(tags) => handleInputChange('interest', tags)}
          />
        )}

        {steps[step].inputType === 'choice' && (
          <div className="flex gap-10">
            <BasicButton text="Yes" onClick={() => setStep(6)} />
            <BasicButton text="No" onClick={() => setStep(7)} />
          </div>
        )}

        <p className="flex justify-start text-xs">{steps[step].rule}</p>
        {steps[step].inputType !== 'choice' && (
          <div className="flex flex-row justify-center pt-10 gap-10">
            <BasicButton
              text="Back"
              onClick={handleBack}
              disabled={isLoading}
            />
            {step === steps.length - 1 ? (
              <BasicButton
                text="Login"
                onClick={handleLogin}
                disabled={isLoading}
              />
            ) : (
              <BasicButton
                text="Next"
                onClick={handleNext}
                disabled={isLoading || isNextButtonDisabled}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
