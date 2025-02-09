import { useState, useCallback, useEffect, useRef } from 'react';

interface UseVoiceControlProps {
  duration?: number; // 재생 시뮬레이션용, 녹음 모드에서는 사용되지 않음
  onComplete?: () => void;
  isModalOpen?: boolean;
  audioUrl?: string;
}

// recordingMode 옵션이 true이면 실제 녹음 기능을 사용합니다.
export const useVoiceControl = ({
  duration = 3000,
  onComplete,
  isModalOpen = false,
  audioUrl,
  recordingMode = false,
}: UseVoiceControlProps & { recordingMode?: boolean } = {}) => {
  // 녹음 모드일 경우
  if (recordingMode) {
    const [isRecording, setIsRecording] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [currentDuration, setCurrentDuration] = useState(0);
    const [recordedFile, setRecordedFile] = useState<File | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const intervalRef = useRef<number | null>(null);
    const timerRef = useRef<number | null>(null);

    // 실제 녹음을 시작하는 함수
    const handleRecord = useCallback(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            chunks.push(event.data);
          }
        };
        mediaRecorder.onstart = () => {
          console.log('[useVoiceControl] 실제 녹음 시작됨.');
          setIsRecording(true);
          setIsFinished(false);
          setCurrentDuration(0);
          // 1초 간격으로 녹음 시간을 업데이트
          intervalRef.current = window.setInterval(() => {
            setCurrentDuration((prev) => prev + 1);
          }, 1000);
          // 60초 후 자동 정지 (최대 녹음 시간)
          timerRef.current = window.setTimeout(() => {
            console.log(
              '[useVoiceControl] 최대 녹음 시간(1분) 도달, 자동 정지.'
            );
            handleStop();
          }, 60000);
        };
        mediaRecorder.onstop = () => {
          console.log('[useVoiceControl] 실제 녹음 정지됨.');
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
          const blob = new Blob(chunks, { type: 'audio/mp3' });
          const file = new File([blob], 'recorded.mp3', { type: 'audio/mp3' });
          setRecordedFile(file);
          setIsRecording(false);
          setIsFinished(true);
          setCurrentDuration((prev) => Math.min(prev, 60));
          onComplete?.();
        };
        mediaRecorder.start();
      } catch (error) {
        console.error('[useVoiceControl] 실제 녹음 시작 에러:', error);
      }
    }, [onComplete]);

    // 녹음을 중지하는 함수
    const handleStop = useCallback(() => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        console.log('[useVoiceControl] 녹음 정지 버튼 클릭됨.');
        setIsRecording(false);
      }
    }, [isRecording]);

    const reset = useCallback(() => {
      setIsRecording(false);
      setIsFinished(false);
      setCurrentDuration(0);
      setRecordedFile(null);
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== 'inactive'
      ) {
        mediaRecorderRef.current.stop();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      console.log('[useVoiceControl] 녹음 상태 리셋됨.');
    }, []);

    // 모달이 닫힐 때 녹음 상태 초기화
    useEffect(() => {
      if (!isModalOpen) {
        reset();
        console.log('[useVoiceControl] 모달 종료로 녹음 상태 초기화됨.');
      }
    }, [isModalOpen, reset]);

    return {
      isPlaying: isRecording, // 녹음 모드에서는 isPlaying을 녹음 여부로 사용합니다.
      isFinished,
      currentDuration,
      handleRecord,
      handleStop,
      reset,
      recordedFile,
    };
  } else {
    // audioUrl이 있는 경우(재생 모드)의 기존 로직 (생략 – 기존 코드와 동일)
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [currentDuration, setCurrentDuration] = useState(0);
    const [recordedFile, setRecordedFile] = useState<File | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
      if (audioUrl) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = '';
        }
        audioRef.current = new Audio(audioUrl);

        const handleEnded = () => {
          setIsPlaying(false);
          setIsFinished(true);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setCurrentDuration(audioRef.current?.duration || 29);
          onComplete?.();
          console.log('[useVoiceControl] 오디오 재생 완료됨.');
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
        console.log('[useVoiceControl] 모달 종료로 상태 초기화됨.');
      }
    }, [isModalOpen]);

    const handlePlay = useCallback(() => {
      if (isFinished) return;
      if (audioUrl && audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            console.log('[useVoiceControl] 오디오 재생 시작됨.');
            intervalRef.current = window.setInterval(() => {
              if (audioRef.current) {
                setCurrentDuration(audioRef.current.currentTime);
              }
            }, 500);
          })
          .catch((error) => {
            console.error('[useVoiceControl] 오디오 재생 에러:', error);
          });
      } else {
        setIsPlaying(true);
        setTimeout(() => {
          setIsPlaying(false);
          setIsFinished(true);
          setCurrentDuration(29);
          onComplete?.();
          console.log('[useVoiceControl] 시뮬레이션 오디오 재생 완료됨.');
        }, duration);
      }
    }, [duration, isFinished, onComplete, audioUrl]);

    const handleRecord = useCallback(() => {
      setIsPlaying(true);
      setTimeout(() => {
        setIsPlaying(false);
        setIsFinished(true);
        setCurrentDuration(29);
        const dummyBlob = new Blob(['dummy audio content'], {
          type: 'audio/mp3',
        });
        const file = new File([dummyBlob], 'recorded.mp3', {
          type: 'audio/mp3',
        });
        setRecordedFile(file);
        onComplete?.();
        console.log(
          '[useVoiceControl] 시뮬레이션 녹음 완료됨. (더미 파일 생성)'
        );
      }, duration);
    }, [duration, onComplete]);

    const reset = useCallback(() => {
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
      console.log('[useVoiceControl] 상태 리셋됨.');
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
  }
};
