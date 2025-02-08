import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useTypingEffect from '@/hooks/useTypingEffect';

import FillitLongLog from '@/assets/icons/fillit-long-logo.svg';
import FilTakeOn from '@/assets/images/fil-takeon.png';

import BasicButton from '@/components/common/Button/BasicButton';
import BasicInput from '@/components/common/Input/BasicInput';
import ImageUpload from '@/components/common/ImageUpload';
import Textarea from '@/components/common/TextArea';
import BirthInput from '@/components/common/Input/BirthInput';
import InterestTags from '@/components/common/InterestTags';
import { SignupForm, SignupState } from '@/types/signup';
import { postSignUp } from '@/api/signup';
import { postInterest } from '@/api/interest';

// 회원가입 단계별 메세지
const steps = [
  {
    message1: 'Hi! It’s your first time here, huh?',
    message2: 'What’s your name? 😎',
    message3: '',
    placeholder: 'Enter your name',
    rule: '영어 최대 8글자, 특수기호 불가',
    inputType: 'text',
  },
  {
    message1: 'Oh, my bad! I meant to ask',
    message2: 'what ID you wanna go with😅',
    message3: '',
    placeholder: 'Enter your ID',
    rule: '영어 5~20자, 소문자/숫자/‘_’ 사용 가능',
    inputType: 'text',
  },
  {
    message1: 'Alright, now',
    message2: 'let’s pick a password! 🔒✨',
    message3: '',
    placeholder: 'Enter your password',
    rule: '영어 8~16자, 대,소문자/숫자 사용 가능',
    inputType: 'text',
  },
  {
    message1: 'Wait, what was the password',
    message2: 'you just said again? 🤔💬',
    message3: '',
    placeholder: 'Enter your password again',
    rule: '',
    inputType: 'text',
  },
  {
    message1: 'Drop your email too 📧✨',
    message2: '',
    message3: '',
    placeholder: 'Enter your email',
    rule: '',
    inputType: 'email',
  },
  {
    message1: 'Yeah, that’s it, for sure! 😎',
    message2: 'Do you have a pic of yourself? 🤔📷',
    message3: '',
    placeholder: '',
    rule: '',
    inputType: 'choice',
  },
  {
    message1: 'Oh, then drop your',
    message2: 'most slay pic! 😎📸',
    message3: '',
    placeholder: '',
    rule: '',
    inputType: 'file',
  },
  {
    message1: "We're almost done signing up!",
    message2: 'When’s your b-day? 🎂',
    message3: '',
    placeholder: '',
    rule: '',
    inputType: 'date',
  },
  {
    message1: 'So, like, what kinda vibe',
    message2: 'are you giving off? 🤔✨',
    message3: '',
    placeholder: 'Introduce yourself',
    rule: '',
    inputType: 'textarea',
  },
  {
    message1: 'Alright, last thing—  ',
    message2: 'what’s your fave stuff? 🧐✨',
    message3: '',
    placeholder: '',
    rule: '',
    inputType: 'tags',
  },
  {
    message1: 'Thanks for the info!',
    message2: 'Yo, you’re like, our new bestie now.',
    message3: 'Catch ya later, fam! 😎✌️',
    placeholder: '',
    rule: '',
    inputType: '',
  },
];

const validationRules = {
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
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<SignupState>({
    mode: 'onChange',
    defaultValues: {
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
    },
  });

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
      console.log('Skipping validation for image selection step');
      return true;
    }

    // 마지막 완료 단계는 검증 스킵
    if (step === steps.length - 1) {
      console.log('Skipping validation for final step');
      return true;
    }

    if (!currentField) {
      console.log('No validation needed for this step');
      return true;
    }

    try {
      const result = await trigger(`regist.${currentField}`);
      console.log(`Validation result for ${currentField}:`, result);
      return result;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  };

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

    if (step === steps.length - 2) {
      // 회원가입 API 호출
      await handleSignup();
    } else if (step === steps.length - 1) {
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
          <BasicInput
            placeholder={steps[step].placeholder}
            value={
              signupState.regist[
                getCurrentField() as keyof SignupState['regist']
              ] as string
            }
            onChange={(e) =>
              handleInputChange(
                getCurrentField() as keyof SignupState['regist'],
                e.target.value
              )
            }
          />
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
        {steps[step].inputType === 'textarea' && <Textarea />}
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
            <BasicButton text="Back" onClick={handleBack} />

            {step === steps.length - 1 ? (
              <BasicButton text="Login" onClick={handleLogin} />
            ) : (
              <BasicButton text="Next" onClick={handleNext} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
