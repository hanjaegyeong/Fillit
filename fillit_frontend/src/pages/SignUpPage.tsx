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

const SignUpPage = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(false);

  const messages = [
    steps[step].message1,
    steps[step].message2,
    steps[step].message3,
  ];

  const typedMessages = useTypingEffect(messages, step, 30);

  const {
    signupState,
    errors,
    isLoading,
    handleInputChange,
    handleSignup,
    handleInterestSubmit,
    handlePasswordConfirmBlur,
    handlePersonalIdBlur,
    handleEmailBlur,
    setErrors,
  } = useSignupForm(setStep);

  useEffect(() => {
    const updateButtonState = async () => {
      const isDisabled = await validateNextButtonState(
        step,
        signupState,
        errors
      );
      setIsNextButtonDisabled(isDisabled);
    };
    updateButtonState();
  }, [step, signupState, errors]);

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
      <SignUpHeader />
      <img src={FilTakeOn} alt="fil-takeon-img" className="w-44" />
      <SignupMessages messages={messages} typedMessages={typedMessages} />
      <SignupInput
        step={step}
        signupState={signupState}
        getCurrentField={() => getCurrentField(step)}
        handleInputChange={handleInputChange}
        handlePersonalIdBlur={handlePersonalIdBlur}
        handlePasswordConfirmBlur={handlePasswordConfirmBlur}
        handleEmailBlur={handleEmailBlur}
        errors={errors}
        validateField={(field, value) => validateField(field, value, setErrors)}
        setStep={setStep}
      />
      {steps[step].inputType !== 'choice' && (
        <SignupButtons
          step={step}
          isLoading={isLoading}
          isNextButtonDisabled={isNextButtonDisabled}
          handleBack={handleBack}
          handleNext={handleNext}
          handleLogin={handleLogin}
          totalSteps={steps.length}
        />
      )}
    </div>
  );
};

export default SignUpPage;
