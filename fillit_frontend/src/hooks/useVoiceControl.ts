import { useState, useCallback, useEffect } from 'react';

interface UseVoiceControlProps {
  duration?: number;
  onComplete?: () => void;
  isModalOpen?: boolean;
}

export const useVoiceControl = ({
  duration = 3000,
  onComplete,
  isModalOpen = false,
}: UseVoiceControlProps = {}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [currentDuration, setCurrentDuration] = useState(0);

  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isModalOpen) {
      setIsPlaying(false);
      setIsFinished(false);
      setCurrentDuration(0);
    }
  }, [isModalOpen]);

  const handlePlay = useCallback(() => {
    if (isFinished) return;

    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
      setIsFinished(true);
      setCurrentDuration(29); // 임시로 29초 고정
      onComplete?.();
    }, duration);
  }, [duration, isFinished, onComplete]);

  const handleRecord = useCallback(() => {
    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
      setIsFinished(true);
      setCurrentDuration(29);
      onComplete?.();
    }, duration);
  }, [duration, onComplete]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setIsFinished(false);
    setCurrentDuration(0);
  }, []);

  return {
    isPlaying,
    isFinished,
    currentDuration,
    handlePlay,
    handleRecord,
    reset,
  };
};
