import { useState, useCallback, useEffect, useRef } from 'react';
import {
  UseVoiceControlPropsBase,
  RecordingControl,
  PlaybackControl,
} from '@/types/voice';

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
  // 관련 상태들을 하나의 객체로 관리
  const [voiceState, setVoiceState] = useState({
    isPlaying: false,
    isFinished: false,
    currentDuration: 0,
    recordedFile: null as File | null,
    isRecording: false,
  });

  // 녹음 모드 관련 ref
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timers = useRef({
    interval: null as number | null,
    timer: null as number | null,
  });

  // 재생 모드 관련 ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const clearTimers = useCallback(() => {
    if (timers.current.interval) {
      clearInterval(timers.current.interval);
      timers.current.interval = null;
    }
    if (timers.current.timer) {
      clearTimeout(timers.current.timer);
      timers.current.timer = null;
    }
  }, []);

  // 녹음 중지 핸들러
  const handleStop = useCallback(() => {
    if (mediaRecorderRef.current && voiceState.isRecording) {
      mediaRecorderRef.current.stop();
      setVoiceState((prev) => ({ ...prev, isRecording: false }));
    }
  }, [voiceState.isRecording]);

  // 녹음 모드 핸들러
  const handleRecord = useCallback(async () => {
    if (!recordingMode) {
      // 재생 모드일 때의 시뮬레이션 녹음
      setVoiceState((prev) => ({ ...prev, isPlaying: true }));
      setTimeout(() => {
        setVoiceState((prev) => ({
          ...prev,
          isPlaying: false,
          isFinished: true,
          currentDuration: 29,
        }));
        const dummyBlob = new Blob(['dummy audio content'], {
          type: 'audio/mp3',
        });
        const file = new File([dummyBlob], 'recorded.mp3', {
          type: 'audio/mpeg',
        });
        setVoiceState((prev) => ({ ...prev, recordedFile: file }));
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
        setVoiceState((prev) => ({
          ...prev,
          isRecording: true,
          isFinished: false,
          currentDuration: 0,
        }));
        // 1초 간격으로 녹음 시간 업데이트
        timers.current.interval = window.setInterval(() => {
          setVoiceState((prev) => ({
            ...prev,
            currentDuration: prev.currentDuration + 1,
          }));
        }, 1000);
        // 최대 60초 후 자동 정지
        timers.current.timer = window.setTimeout(() => {
          console.log('[useVoiceControl] 최대 녹음 시간(1분) 도달, 자동 정지.');
          handleStop();
        }, 60000);
      };

      // 녹음 종료
      mediaRecorder.onstop = () => {
        if (timers.current.interval) {
          clearInterval(timers.current.interval);
          timers.current.interval = null;
        }
        if (timers.current.timer) {
          clearTimeout(timers.current.timer);
          timers.current.timer = null;
        }
        const blob = new Blob(chunks, { type: 'audio/mp3' });
        const file = new File([blob], 'recorded.mp3', { type: 'audio/mp3' });
        setVoiceState((prev) => ({
          ...prev,
          recordedFile: file,
          isRecording: false,
          isFinished: true,
          currentDuration: Math.min(prev.currentDuration, 60),
        }));
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
    if (voiceState.isFinished) return;
    if (audioUrl && audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setVoiceState((prev) => ({ ...prev, isPlaying: true }));
          console.log('[useVoiceControl] 오디오 재생 시작됨.');
          timers.current.interval = window.setInterval(() => {
            if (audioRef.current) {
              const currentTime = audioRef.current.currentTime;
              setVoiceState((prev) => ({
                ...prev,
                currentDuration: Math.floor(currentTime) || 0,
              }));
            }
          }, 500);
        })
        .catch((error) => {
          console.error('[useVoiceControl] 오디오 재생 에러:', error);
        });
    } else {
      setVoiceState((prev) => ({ ...prev, isPlaying: true }));
      setTimeout(() => {
        setVoiceState((prev) => ({
          ...prev,
          isPlaying: false,
          isFinished: true,
          currentDuration: 29,
        }));
        onComplete?.();
        console.log('[useVoiceControl] 시뮬레이션 오디오 재생 완료됨.');
      }, duration);
    }
  }, [duration, voiceState.isFinished, onComplete, audioUrl]);

  // 공통 상태 리셋 핸들러
  const reset = useCallback(() => {
    setVoiceState((prev) => ({
      ...prev,
      isRecording: false,
      isFinished: false,
      currentDuration: 0,
      recordedFile: null,
    }));

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

    clearTimers();
  }, [clearTimers, recordingMode]);

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
            setVoiceState((prev) => ({ ...prev, recordedFile: file }));
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
      if (!voiceState.recordedFile) {
        reset();
      }
    }
  }, [isModalOpen, reset, voiceState.recordedFile]);

  // 오디오 URL 변경
  useEffect(() => {
    if (!recordingMode && audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      audioRef.current = new Audio(audioUrl);

      const handleEnded = () => {
        setVoiceState((prev) => ({
          ...prev,
          isPlaying: false,
          isFinished: true,
        }));
        if (timers.current.interval) {
          clearInterval(timers.current.interval);
          timers.current.interval = null;
        }
        setVoiceState((prev) => ({
          ...prev,
          currentDuration: Math.floor(audioRef.current?.duration || 29),
        }));
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

  useEffect(() => {
    return () => {
      clearTimers();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [clearTimers]);

  return recordingMode
    ? {
        isPlaying: voiceState.isRecording,
        isFinished: voiceState.isFinished,
        currentDuration: voiceState.currentDuration,
        handleRecord,
        handleStop,
        reset,
        recordedFile: voiceState.recordedFile,
      }
    : {
        isPlaying: voiceState.isPlaying,
        isFinished: voiceState.isFinished,
        currentDuration: voiceState.currentDuration,
        handlePlay,
        handleRecord,
        reset,
        recordedFile: voiceState.recordedFile,
      };
}
