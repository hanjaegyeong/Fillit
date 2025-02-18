import { SignupState } from '@/types/signup';
import { steps } from '@/constants/signupSteps';
import BasicInput from '@/components/common/Input/BasicInput';
import ImageUpload from '@/components/common/ImageUpload';
import Textarea from '@/components/common/TextArea';
import BirthInput from '@/components/common/Input/BirthInput';
import InterestTags from '@/components/common/InterestTags';
import BasicButton from '@/components/common/Button/BasicButton';

interface SignupInputProps {
  step: number;
  signupState: SignupState;
  setSignupState: React.Dispatch<React.SetStateAction<SignupState>>;
  getCurrentField: () => keyof SignupState['regist'] | null;
  handleInputChange: (
    field: keyof SignupState['regist'],
    value: string | Date | string[]
  ) => void;

  errors: { [key: string]: string };

  validateField: (
    field: keyof SignupState['regist'],
    value: string
  ) => Promise<boolean>;
  setStep: (value: React.SetStateAction<number>) => void;
  validationStatus: { personalId: boolean; email: boolean };
}

const SignupInput = ({
  step,
  signupState,
  setSignupState,
  getCurrentField,
  handleInputChange,
  errors,
  validateField,
  setStep,
  validationStatus,
}: SignupInputProps) => {
  const currentField = getCurrentField();

  return (
    <div className="pt-6">
      {steps[step].inputType === 'text' && (
        <div className="w-full">
          <BasicInput
            type={
              currentField === 'password' || currentField === 'passwordConfirm'
                ? 'password'
                : 'text'
            }
            placeholder={steps[step].placeholder}
            value={
              signupState.regist[
                currentField as keyof SignupState['regist']
              ] as string
            }
            onChange={async (e) => {
              const field = currentField as keyof SignupState['regist'];
              const value = e.target.value;
              handleInputChange(field, value);
              if (field !== 'passwordConfirm') {
                await validateField(field, value);
              }
            }}
            className={errors[currentField as string] ? 'border-red-500' : ''}
          />
          {errors[currentField as string] ? (
            <p className="text-red-500 text-xs mt-1">
              {errors[currentField as string]}
            </p>
          ) : (
            currentField === 'personalId' &&
            validationStatus[currentField] && (
              <p className="text-green-500 text-xs mt-1">
                사용 가능한 아이디 입니다.
              </p>
            )
          )}
        </div>
      )}

      {steps[step].inputType === 'email' && (
        <div className="w-full">
          <BasicInput
            placeholder={steps[step].placeholder}
            value={signupState.regist.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email ? (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          ) : (
            validationStatus.email && (
              <p className="text-green-500 text-xs mt-1">
                사용 가능한 이메일입니다.
              </p>
            )
          )}
        </div>
      )}

      {steps[step].inputType === 'date' && (
        <BirthInput
          value={signupState.regist.birthDate}
          onChange={(date) => handleInputChange('birthDate', date)}
        />
      )}

      {steps[step].inputType === 'file' && (
        <ImageUpload
          onImageUpload={(file) => {
            setSignupState((prev) => ({
              ...prev,
              profileImage: file,
            }));
          }}
        />
      )}

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
          <BasicButton text="No" onClick={() => setStep(7)} />
          <BasicButton text="Yes" onClick={() => setStep(6)} />
        </div>
      )}

      <p className="flex justify-start text-xs">{steps[step].rule}</p>
    </div>
  );
};

export default SignupInput;
