import { useState, useCallback, useEffect, useRef } from 'react';

// 공통 기본 프로퍼티
interface UseVoiceControlPropsBase {
  duration?: number; // 재생 시뮬레이션용, 녹음 모드에서는 사용되지 않음
  onComplete?: () => void;
  isModalOpen?: boolean;
  audioUrl?: string;
}

// 재생(Playback) 모드에서 반환할 속성
export interface PlaybackControl extends UseVoiceControlPropsBase {
  isPlaying: boolean;
  isFinished: boolean;
  currentDuration: number;
  handlePlay: () => void;
  handleRecord: () => void;
  reset: () => void;
  recordedFile: File | null;
}

// 녹음(Recording) 모드에서 반환할 속성
export interface RecordingControl extends UseVoiceControlPropsBase {
  isPlaying: boolean;
  isFinished: boolean;
  currentDuration: number;
  handleRecord: () => void;
  handleStop: () => void;
  reset: () => void;
  recordedFile: File | null;
}

// 오버로드 선언: recordingMode가 true인 경우
export function useVoiceControl(
  props: UseVoiceControlPropsBase & { recordingMode: true }
): RecordingControl;

// 오버로드 선언: recordingMode가 false 또는 생략된 경우
export function useVoiceControl(
  props?: UseVoiceControlPropsBase & { recordingMode?: false }
): PlaybackControl;

// 함수 구현
export function useVoiceControl({
  duration = 3000,
  onComplete,
  isModalOpen = false,
  audioUrl,
  recordingMode = false,
}: UseVoiceControlPropsBase & { recordingMode?: boolean } = {}):
  | PlaybackControl
  | RecordingControl {
  // 공통 상태
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [currentDuration, setCurrentDuration] = useState(0);
  const [recordedFile, setRecordedFile] = useState<File | null>(null);

  // 녹음 모드 관련 상태 및 ref
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  // 재생 모드 관련 ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 녹음 중지 핸들러
  const handleStop = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  // 녹음 모드 핸들러
  const handleRecord = useCallback(async () => {
    if (!recordingMode) {
      // 재생 모드일 때의 시뮬레이션 녹음
      setIsPlaying(true);
      setTimeout(() => {
        setIsPlaying(false);
        setIsFinished(true);
        setCurrentDuration(29);
        const dummyBlob = new Blob(['dummy audio content'], {
          type: 'audio/mp3',
        });
        const file = new File([dummyBlob], 'recorded.mp3', {
          type: 'audio/mpeg',
        });
        setRecordedFile(file);
        onComplete?.();
      }, duration);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      // 녹음 모드 초기화
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];

      // 녹음 데이터 처리
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      // 녹음 시작
      mediaRecorder.onstart = () => {
        setIsRecording(true);
        setIsFinished(false);
        setCurrentDuration(0);
        // 1초 간격으로 녹음 시간 업데이트
        intervalRef.current = window.setInterval(() => {
          setCurrentDuration((prev) => prev + 1);
        }, 1000);
        // 최대 60초 후 자동 정지
        timerRef.current = window.setTimeout(() => {
          console.log('[useVoiceControl] 최대 녹음 시간(1분) 도달, 자동 정지.');
          handleStop();
        }, 60000);
      };

      // 녹음 종료
      mediaRecorder.onstop = () => {
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
        // 스트림 종료 처리
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());

        // 녹음 파일 저장
        const reader = new FileReader();
        reader.onload = () => {
          const dataURL = reader.result as string;
          localStorage.setItem('recordedVoiceData', dataURL);
        };
        reader.readAsDataURL(file);
        onComplete?.();
      };

      mediaRecorder.start();
    } catch (error) {
      console.error('[useVoiceControl] 실제 녹음 시작 에러:', error);
    }
  }, [duration, onComplete, recordingMode, handleStop]);

  // 재생 모드 핸들러
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

  // 공통 상태 리셋 핸들러
  const reset = useCallback(() => {
    setIsRecording(false);
    setIsFinished(false);
    setCurrentDuration(0);
    setRecordedFile(null);

    // 녹음 모드 처리
    if (recordingMode) {
      localStorage.removeItem('recordedVoiceData');
      // 녹음 중지
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== 'inactive'
      ) {
        mediaRecorderRef.current.stop();
      }
      // 재생 모드 처리
    } else if (audioRef.current) {
      audioRef.current.pause(); // 재생 중지
      audioRef.current.currentTime = 0; // 재생 시간 초기화
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [recordingMode]);

  // 저장된 녹음 파일 복원
  useEffect(() => {
    if (recordingMode) {
      const storedData = localStorage.getItem('recordedVoiceData');
      if (storedData) {
        fetch(storedData)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], 'recorded.mp3', {
              type: 'audio/mp3',
            });
            setRecordedFile(file);
          })
          .catch((error) => {
            console.error(
              '[useVoiceControl] 저장된 녹음 파일 복원 실패:',
              error
            );
          });
      }
    }
  }, [recordingMode]);
  // 모달 상태 변경
  useEffect(() => {
    if (!isModalOpen) {
      if (!recordedFile) {
        reset();
      }
    }
  }, [isModalOpen, reset, recordedFile]);

  // 오디오 URL 변경
  useEffect(() => {
    if (!recordingMode && audioUrl) {
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
  }, [audioUrl, onComplete, recordingMode]);

  return recordingMode
    ? {
        isPlaying: isRecording,
        isFinished,
        currentDuration,
        handleRecord,
        handleStop,
        reset,
        recordedFile,
      }
    : {
        isPlaying,
        isFinished,
        currentDuration,
        handlePlay,
        handleRecord,
        reset,
        recordedFile,
      };
}
