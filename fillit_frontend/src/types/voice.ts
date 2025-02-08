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
