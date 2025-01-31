import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTypingEffect from '@/hooks/useTypingEffect';

import FillitLongLog from '@/assets/icons/fillit-long-logo.svg';
import FilTakeOn from '@/assets/images/fil-takeon.png';

import BasicInput from '@/components/common/BasicInput';
import BasicButton from '@/components/common/Button/BasicButton';
import ProfileImageUploader from '@/components/common/ImageUpload';
import BioTextarea from '@/components/common/TextArea';
import InterestTags from '@/components/common/Tags';

const steps = [
  {
    message1: 'Oh, you’re from somewhere else, huh?',
    message2: 'What’s your name?" 🌍✨',
    message3: '',
    placeholder: 'Enter your name',
    rule: '영어 최대 8글자, 특수기호 불가',
    inputType: 'text',
  },
  {
    message1: 'Do you wanna use a pic you already',
    message2: 'have or should I take a new one ',
    message3: 'for you? 📸✨',
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
    message1: 'Hit me with a quick',
    message2: 'intro about yourself! 😄✨',
    message3: '',
    placeholder: 'Introduce yourself',
    rule: '',
    inputType: 'textarea',
  },
  {
    message1: 'Alright, last thing—',
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

const SocialSignUpPage = () => {
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
    <>
      <header className="absolute top-0 left-0 w-full py-4 px-6 z-10">
        <img src={FillitLongLog} className="h-10" />
      </header>
      <div className="flex flex-col justify-center items-center h-screen max-h-screen">
        <div className="flex flex-col items-center">
          <img src={FilTakeOn} alt="fil-takeon-img" className="w-44" />
          <div className="flex flex-col items-center">
            {typedMessages.map((msg, index) => (
              <p
                key={index}
                className="inline-block text-center text-white bg-black px-2"
              >
                {msg}
              </p>
            ))}
          </div>
        </div>
        <div className="pt-6">
          {steps[step].inputType === 'text' && (
            <BasicInput placeholder={steps[step].placeholder} />
          )}
          {steps[step].inputType === 'file' && <ProfileImageUploader />}
          {steps[step].inputType === 'textarea' && <BioTextarea />}
          {steps[step].inputType === 'tags' && <InterestTags />}
          {steps[step].inputType === 'choice' && (
            <div className="flex gap-10">
              <BasicButton text="Yes" onClick={() => setStep(2)} />
              <BasicButton text="No" onClick={() => setStep(3)} />
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

export default SocialSignUpPage;
