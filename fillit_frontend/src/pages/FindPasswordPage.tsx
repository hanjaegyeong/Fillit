import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTypingEffect from '@/hooks/useTypingEffect';
import { FIND_PASSWORD_STEPS } from '@/constants/findPasswordSteps';

import FillitLongLog from '@/assets/icons/fillit-long-logo.svg';
import FilTakeOn from '@/assets/images/fil-takeon.png';

import BasicInput from '@/components/common/Input/BasicInput';
import BasicButton from '@/components/common/Button/BasicButton';

const FindPasswordPage = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < FIND_PASSWORD_STEPS.length - 1) setStep((prev) => prev + 1);
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
    FIND_PASSWORD_STEPS[step].message1,
    FIND_PASSWORD_STEPS[step].message2,
    FIND_PASSWORD_STEPS[step].message3,
  ];

  const typedMessages = useTypingEffect(messages, step, 30);

  return (
    <div className="container-base justify-center">
      <header className="fixed top-0 w-full py-4 px-6 z-10">
        <img src={FillitLongLog} className="h-10" />
      </header>
      <img src={FilTakeOn} alt="fil-takeon-img" className="w-44" />
      {typedMessages.map((msg, index) => (
        <p key={index} className="inline-block text-white bg-black px-2">
          {msg}
        </p>
      ))}
      <div className="pt-6">
        {FIND_PASSWORD_STEPS[step].inputType === 'search' && (
          <>
            <div>
              <BasicInput placeholder="Enter your personalId" />
            </div>
            <div className="pt-2">
              <BasicInput placeholder="Enter your Email" />
            </div>
          </>
        )}
        {FIND_PASSWORD_STEPS[step].inputType === 'check' && (
          <>
            <div>
              <BasicInput placeholder="Enter your code" />
            </div>
            <div className=" flex pt-2 justify-center items-center">
              <BasicButton text="Next" onClick={() => setStep(2)} />
            </div>
          </>
        )}
        {FIND_PASSWORD_STEPS[step].inputType === 'password' && (
          <>
            <div>
              <BasicInput placeholder="Enter your new password" />
            </div>
            <div className="pt-2">
              <BasicInput placeholder="Enter your password again" />
            </div>
          </>
        )}
        <p className="flex justify-start text-xs">
          {FIND_PASSWORD_STEPS[step].rule}
        </p>
        {FIND_PASSWORD_STEPS[step].inputType !== 'check' && (
          <div className="flex flex-row pt-10 gap-10">
            <BasicButton text="Back" onClick={handleBack} />

            {step === FIND_PASSWORD_STEPS.length - 1 ? (
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

export default FindPasswordPage;
