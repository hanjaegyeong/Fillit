import BasicButton from '@/components/common/Button/BasicButton';

interface SignupButtonsProps {
  step: number;
  isLoading: boolean;
  isNextButtonDisabled: boolean;
  handleBack: () => void;
  handleNext: () => void;
  handleLogin: () => void;
  totalSteps: number;
  showBackButton?: boolean;
}

const SignupButtons = ({
  step,
  isLoading,
  isNextButtonDisabled,
  handleBack,
  handleNext,
  handleLogin,
  totalSteps,
  showBackButton = true,
}: SignupButtonsProps) => {
  return (
    <div className="flex flex-row justify-center pt-10 gap-10">
      {showBackButton && (
        <BasicButton text="Back" onClick={handleBack} disabled={isLoading} />
      )}
      {step === totalSteps - 1 ? (
        <BasicButton text="Login" onClick={handleLogin} disabled={isLoading} />
      ) : (
        <BasicButton
          text="Next"
          onClick={handleNext}
          disabled={isLoading || isNextButtonDisabled}
        />
      )}
    </div>
  );
};

export default SignupButtons;
