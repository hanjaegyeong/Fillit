import { MessageType } from '@/constants/messageType';

export interface Message {
  id: number;
  userName: string;
  personalId: string;
  messageContent: string;
  createdAt: string;
}

export interface MessagePostForm {
  chatRoomId: number;
  messageContent: string;
  type: MessageType;
}

export interface MessageListResponse {
  messages: Message[];
  nextCursor: number;
  hasNext: boolean;
}

export interface ChatRoom {
  chatRoomId: number;
  otherUser: string;
  profileImageUrl: string | null;
  lastMessageContent: string;
  lastMessageTime: string;
  unreadMessageCount: number;
}

export interface ChatRoomInfo {
  chatRoomId: number;
  personalId: string;
  otherPersonalId: string;
  otherUserName: string;
  otherProfileImageUrl: string | null;
}

export interface ChatSearch {
  size: number;
  cursorId: number;
  word: string;
}
