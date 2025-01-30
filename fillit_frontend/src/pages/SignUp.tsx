import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import FillitLongLog from '@/assets/icons/fillit-long-logo.svg';
import FilTakeOn from '@/assets/images/fil-takeon.png';

import BasicButton from '@/components/common/Button/BasicButton';
import BasicInput from '@/components/common/BasicInput';
import ProfileImageUploader from '@/components/common/ImageUpload';
import BioTextarea from '@/components/common/TextArea';
import BirthInput from '@/components/common/BirthInput';
import InterestTags from '@/components/common/Tags';

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
    message2: 'Do you have a pic of yourself?" 🤔📷',
    message3: '',
    placeholder: '',
    rule: '',
    inputType: 'choice',
  },
  {
    message1: 'Oh, then drop your',
    message2: 'most slay pic!" 😎📸',
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
    message2: 'are you giving off?" 🤔✨',
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

const SignUp = () => {
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

  return (
    <>
      <header>
        <img src={FillitLongLog} className="pt-4 pl-4" />
      </header>
      <div className="flex flex-col justify-center items-center ">
        <div className="flex flex-col items-center pt-24">
          <img src={FilTakeOn} alt="fil-takeon-img" className="w-44" />
          <div>
            {messages.map((msg, index) => (
              <p key={index} className="text-center text-white bg-black px-2">
                {msg}
              </p>
            ))}
          </div>
        </div>
        <div className="pt-6">
          {steps[step].inputType === 'text' && (
            <BasicInput placeholder={steps[step].placeholder} />
          )}
          {steps[step].inputType === 'email' && (
            <BasicInput placeholder={steps[step].placeholder} />
          )}
          {steps[step].inputType === 'date' && <BirthInput />}
          {steps[step].inputType === 'file' && <ProfileImageUploader />}
          {steps[step].inputType === 'textarea' && <BioTextarea />}
          {steps[step].inputType === 'tags' && <InterestTags />}
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
    </>
  );
};

export default SignUp;
