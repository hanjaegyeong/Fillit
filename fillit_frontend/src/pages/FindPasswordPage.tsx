import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTypingEffect from '@/hooks/useTypingEffect';

import FillitLongLog from '@/assets/icons/fillit-long-logo.svg';
import FilTakeOn from '@/assets/images/fil-takeon.png';

import BasicInput from '@/components/common/Input/BasicInput';
import BasicButton from '@/components/common/Button/BasicButton';

const steps = [
  {
    message1: 'Did you forget password?',
    message2: 'Alright then, spill your name, email,',
    message3: 'and username! 😎💻',
    placeholder: '',
    rule: '',
    inputType: 'search',
  },
  {
    message1: 'Yo, I just shot you an email',
    message2: '—peep it and drop in the code! 📧🔑',
    message3: '',
    placeholder: '',
    rule: '',
    inputType: 'check',
  },
  {
    message1: 'Cool, found your account',
    message2: 'Let’s set up a new password! 🔒✨',
    message3: '',
    placeholder: '',
    rule: '',
    inputType: 'password',
  },
  {
    message1: 'All good now,',
    message2: 'Don’t lose it next time! 😎✌️',
    message3: '',
    placeholder: '',
    rule: '',
    inputType: '',
  },
];

const FindPasswordPage = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < steps.length - 1) setStep((prev) => prev + 1);
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
        <p key={index} className="inline-block text-white bg-black px-2">
          {msg}
        </p>
      ))}
      <div className="pt-6">
        {steps[step].inputType === 'search' && (
          <>
            <div>
              <BasicInput placeholder="Enter your name" />
            </div>
            <div className="pt-2">
              <BasicInput placeholder="Enter your Email" />
            </div>
          </>
        )}
        {steps[step].inputType === 'check' && (
          <>
            <div>
              <BasicInput placeholder="Enter your code" />
            </div>
            <div className=" flex pt-2 justify-center items-center">
              <BasicButton text="Next" onClick={() => setStep(2)} />
            </div>
          </>
        )}
        {steps[step].inputType === 'password' && (
          <>
            <div>
              <BasicInput placeholder="Enter your new password" />
            </div>
            <div className="pt-2">
              <BasicInput placeholder="Enter your password again" />
            </div>
          </>
        )}
        <p className="flex justify-start text-xs">{steps[step].rule}</p>
        {steps[step].inputType !== 'check' && (
          <div className="flex flex-row pt-10 gap-10">
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

export default FindPasswordPage;
