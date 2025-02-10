import { SignupState } from '@/types/signup';
import { validationRules } from '@/constants/validationRules';
import { steps } from '@/constants/signupSteps';

interface ValidationErrors {
  [key: string]: string;
}

// 현재 단계의 필드 이름 반환하는 함수
export const getCurrentField = (
  step: number
): keyof SignupState['regist'] | null => {
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
export const validateCurrentStep = async (
  step: number,
  signupState: SignupState,
  setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>
): Promise<boolean> => {
  const currentField = getCurrentField(step);

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

// 개별 필드 유효성 검사
export const validateField = async (
  field: keyof SignupState['regist'],
  value: string,
  setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>
): Promise<boolean> => {
  const rule = validationRules[field];
  if (!rule) return true;

  let isValid = true;
  let errorMessage = '';

  // 필수 입력 검사
  if (rule.required && !value) {
    isValid = false;
    errorMessage = '필수 입력 항목입니다';
  }
  // 최소 길이 검사
  else if (rule.minLength && value.length < rule.minLength) {
    isValid = false;
    errorMessage = `최소 ${rule.minLength}자 이상 입력하세요`;
  }
  // 최대 길이 검사
  else if (rule.maxLength && value.length > rule.maxLength) {
    isValid = false;
    errorMessage = `최대 ${rule.maxLength}자까지 입력 가능합니다`;
  }
  // 패턴 검사
  else if (rule.pattern && !rule.pattern.value.test(value)) {
    isValid = false;
    errorMessage = rule.pattern.message;
  }

  // 에러 상태 업데이트
  setErrors((prev: ValidationErrors) => ({
    ...prev,
    [field]: errorMessage,
  }));

  return isValid;
};

// 다음 버튼 활성화 여부 검증
export const validateNextButtonState = async (
  step: number,
  signupState: SignupState,
  errors: { [key: string]: string }
): Promise<boolean> => {
  const currentField = getCurrentField(step);

  // 이메일이나 personalId 필드에서 중복 에러 메시지가 있다면 비활성화
  if (
    (currentField === 'email' && errors.email) ||
    (currentField === 'personalId' && errors.personalId)
  ) {
    return true;
  }

  // 현재 단계 유효성 검증 결과의 반대값 반환
  const isValid = await validateCurrentStep(step, signupState, () => {});
  return !isValid;
};

// 비밀번호 일치 여부 검증
export const validatePasswordMatch = (
  password: string,
  passwordConfirm: string
): boolean => {
  return password === passwordConfirm;
};

// 이메일 형식 검증
export const validateEmailFormat = (email: string): boolean => {
  const emailRule = validationRules.email.pattern;
  if (!emailRule) return true;
  return emailRule.value.test(email);
};
