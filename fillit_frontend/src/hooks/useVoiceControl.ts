import { useState, useCallback, useEffect, useRef } from 'react';

interface UseVoiceControlProps {
  duration?: number;
  onComplete?: () => void;
  isModalOpen?: boolean;
  audioUrl?: string;
}

export const useVoiceControl = ({
  duration = 3000,
  onComplete,
  isModalOpen = false,
  audioUrl,
}: UseVoiceControlProps = {}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [currentDuration, setCurrentDuration] = useState(0);
  const [recordedFile, setRecordedFile] = useState<File | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);

  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      audioRef.current = new Audio(audioUrl);

      const handleEnded = () => {
        setIsPlaying(false);
        setIsFinished(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setCurrentDuration(audioRef.current?.duration || 29);
        onComplete?.();
      };

      audioRef.current.addEventListener('ended', handleEnded);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('ended', handleEnded);
          audioRef.current.pause();
          audioRef.current.src = '';
          audioRef.current = null;
        }
      };
    }
  }, [audioUrl, onComplete]);

  useEffect(() => {
    if (!isModalOpen) {
      setIsPlaying(false);
      setIsFinished(false);
      setCurrentDuration(0);
      setRecordedFile(null);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isModalOpen]);

  const handlePlay = useCallback(() => {
    if (isFinished) return;

    if (audioUrl && audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          // 0.5초 간격으로 재생 시간을 업데이트
          intervalRef.current = window.setInterval(() => {
            if (audioRef.current) {
              setCurrentDuration(audioRef.current.currentTime);
            }
          }, 500);
        })
        .catch((error) => {
          console.error('Audio playback error:', error);
        });
    } else {
      // audioUrl이 없는 경우, 기존 시뮬레이션 방식으로 처리
      setIsPlaying(true);
      setTimeout(() => {
        setIsPlaying(false);
        setIsFinished(true);
        setCurrentDuration(29);
        onComplete?.();
      }, duration);
    }
  }, [duration, isFinished, onComplete, audioUrl]);

  const handleRecord = useCallback(() => {
    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
      setIsFinished(true);
      setCurrentDuration(29);
      // dummy recorded file
      const dummyBlob = new Blob(['dummy audio content'], {
        type: 'audio/mp3',
      });
      const file = new File([dummyBlob], 'recorded.mp3', { type: 'audio/mp3' });
      setRecordedFile(file);
      onComplete?.();
    }, duration);
  }, [duration, onComplete]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setIsFinished(false);
    setCurrentDuration(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  return {
    isPlaying,
    isFinished,
    currentDuration,
    handlePlay,
    handleRecord,
    reset,
    recordedFile,
  };
};
