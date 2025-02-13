import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTypingEffect from '@/hooks/useTypingEffect';
import { FIND_PASSWORD_STEPS } from '@/constants/findPasswordSteps';
import {
  postEmailCode,
  postVerifyEmailCode,
  patchPassword,
} from '@/api/password';

import FillitLongLog from '@/assets/icons/fillit-long-logo.svg';
import FilTakeOn from '@/assets/images/fil-takeon.png';

import BasicInput from '@/components/common/Input/BasicInput';
import BasicButton from '@/components/common/Button/BasicButton';

const FindPasswordPage = () => {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [personalId, setPersonalId] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearchStep = async () => {
    try {
      await postEmailCode(email, personalId);
      setStep(1);
      setError('');
    } catch (error: any) {
      if (error.message.includes('이메일 전송')) {
        setError('이메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        setError(error.message || '알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  const handleVerifyStep = async () => {
    try {
      await postVerifyEmailCode(email, code);
      setStep(2);
      setError('');
    } catch (error) {
      setError('인증 코드가 올바르지 않습니다.');
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      await patchPassword(email, newPassword);
      setStep(3);
      setError('');
    } catch (error) {
      setError('비밀번호 변경에 실패했습니다.');
    }
  };

  const handleNext = async () => {
    if (step === 0) {
      await handleSearchStep();
    } else if (step === 1) {
      await handleVerifyStep();
    } else if (step === 2) {
      await handlePasswordChange();
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
              <BasicInput
                placeholder="Enter your personalId"
                value={personalId}
                onChange={(e) => setPersonalId(e.target.value)}
              />
            </div>
            <div className="pt-2">
              <BasicInput
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </>
        )}
        {FIND_PASSWORD_STEPS[step].inputType === 'check' && (
          <>
            <div>
              <BasicInput
                placeholder="Enter your code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className=" flex pt-2 justify-center items-center">
              <BasicButton text="Next" onClick={() => setStep(2)} />
            </div>
          </>
        )}
        {FIND_PASSWORD_STEPS[step].inputType === 'password' && (
          <>
            <div>
              <BasicInput
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="pt-2">
              <BasicInput
                type="password"
                placeholder="Enter your password again"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </>
        )}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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
