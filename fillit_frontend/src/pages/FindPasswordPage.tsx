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
import LoadingOverlay from '@/components/common/Loading/LoadingOverlay';

const FindPasswordPage = () => {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [personalId, setPersonalId] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearchStep = async () => {
    try {
      setIsLoading(true);
      await postEmailCode(email, personalId);
      setError('');
      setStep(1);
    } catch (error: Error | unknown) {
      if (error instanceof Error && error.message.includes('이메일 전송')) {
        setError('이메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        setError(
          error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyStep = async () => {
    try {
      setIsLoading(true);
      await postVerifyEmailCode(email, code);
      setError('');
      setStep(2);
    } catch (error) {
      setError('인증 코드가 올바르지 않습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      setIsLoading(true);
      await patchPassword(email, newPassword);
      setError('');
      setStep(3);
    } catch (error) {
      setError('비밀번호 변경에 실패했습니다.');
    } finally {
      setIsLoading(false);
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
              {newPassword && (
                <p
                  className={`text-xs mt-1 ${
                    /^[A-Za-z0-9]+$/.test(newPassword) &&
                    newPassword.length >= 4 &&
                    newPassword.length <= 16
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  영어 4~16자, 대,소문자/숫자 사용 가능
                </p>
              )}
            </div>
            <div className="pt-2">
              <BasicInput
                type="password"
                placeholder="Enter your password again"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPassword && (
                <p
                  className={`text-xs mt-1 ${
                    newPassword === confirmPassword
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {newPassword === confirmPassword
                    ? '비밀번호가 일치합니다.'
                    : '비밀번호가 일치하지 않습니다.'}
                </p>
              )}
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
      {isLoading && <LoadingOverlay />}
    </div>
  );
};

export default FindPasswordPage;
