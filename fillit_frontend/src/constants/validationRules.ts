import { SignupState } from '@/types/signup';

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

export const validationRules: Record<
  keyof SignupState['regist'],
  ValidationRule
> = {
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
    minLength: 4,
    maxLength: 20,
    pattern: {
      value: /^[a-z0-9_]+$/,
      message: '소문자, 숫자, 언더스코어만 사용 가능합니다',
    },
  },
  password: {
    required: true,
    minLength: 4,
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
    // pattern: {
    //   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    //   message: '올바른 이메일 형식이 아닙니다',
    // },
  },
  birthDate: { required: false }, // 임시
  introduction: { required: false }, // 임시
  interest: { required: true },
};
