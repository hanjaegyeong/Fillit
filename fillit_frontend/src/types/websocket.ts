import { MessageType } from '@/enum/MessageType';

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
