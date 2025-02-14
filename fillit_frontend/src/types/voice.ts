interface VoiceType {
  personalId: string;
  profileImageUrl: string | null;
  audioUrl: string;
}

export interface Voice extends VoiceType {
  voiceId: number;
}

export interface VoiceReply extends VoiceType {
  voiceReplyId: number;
}

// 공통 기본 프로퍼티
export interface UseVoiceControlPropsBase {
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
