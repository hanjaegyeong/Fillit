/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useTypingEffect from '@/hooks/useTypingEffect';

import { steps } from '@/constants/signupSteps';
import { useSignupForm } from '@/hooks/useSignupForm';
import SignupInput from '@/components/Signup/SignupInput';

import FilTakeOn from '@/assets/images/fil-takeon.png';

import SignUpHeader from '@/components/Signup/SignupHeader';
import SignupButtons from '@/components/Signup/StepButtons';
import SignupMessages from '@/components/Signup/StepMessages';
import {
  getCurrentField,
  validateCurrentStep,
  validateField,
  validateNextButtonState,
} from '@/utils/signupValidation';
import LoadingSpinner from '@/components/common/Loading/LoadingSpinner';

const SignUpPage = () => {
  const [step, setStep] = useState(0);
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(false);
  const navigate = useNavigate();

  const messages = [
    steps[step].message1,
    steps[step].message2,
    steps[step].message3,
  ];
  const typedMessages = useTypingEffect(messages, step, 30);

  const {
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
    validationStatus,
  } = useSignupForm(setStep);

  useEffect(() => {
    const updateButtonState = async () => {
      const isDisabled = await validateNextButtonState(
        step,
        signupState,
        errors,
        validationStatus
      );
      setIsNextButtonDisabled(isDisabled);
    };
    updateButtonState();
  }, [step, signupState, errors, validationStatus]);

  const handleNext = async () => {
    if (!(await validateCurrentStep(step, signupState, setErrors))) return;

    if (step === steps.length - 3) {
      await handleSignup();
    } else if (step === steps.length - 2) {
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

  return (
    <div className="container-base justify-center">
      {isLoading && <LoadingSpinner />}
      <SignUpHeader />
      <img src={FilTakeOn} alt="fil-takeon-img" className="w-44" />
      <SignupMessages messages={messages} typedMessages={typedMessages} />
      <SignupInput
        step={step}
        signupState={signupState}
        setSignupState={setSignupState}
        getCurrentField={() => getCurrentField(step)}
        handleInputChange={handleInputChange}
        handlePersonalIdBlur={handlePersonalIdBlur}
        handlePasswordConfirmBlur={handlePasswordConfirmBlur}
        handleEmailBlur={handleEmailBlur}
        errors={errors}
        validateField={(field, value) => validateField(field, value, setErrors)}
        setStep={setStep}
        validationStatus={validationStatus}
      />
      {steps[step].inputType !== 'choice' && (
        <SignupButtons
          step={step}
          isLoading={isLoading}
          isNextButtonDisabled={isNextButtonDisabled || isLoading}
          handleBack={handleBack}
          handleNext={handleNext}
          handleLogin={handleLogin}
          totalSteps={steps.length}
          showBackButton={
            step !== steps.length - 1 && step !== steps.length - 2
          }
        />
      )}
    </div>
  );
};

export default SignUpPage;
