import { MessageType } from '@/constants/messageType';

export interface WebSocketMessage {
  chatRoomId: number;
  messageContent: string;
  type: MessageType;
}

export interface WebSocketResponse {
  id: number;
  userName: string;
  personalId: string;
  messageContent: string;
  createdAt: string;
}
