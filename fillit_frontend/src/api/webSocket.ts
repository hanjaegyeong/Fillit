import { WebSocketMessage, WebSocketResponse } from '@/types/websocket';

// 각 채팅방의 연결을 저장
const socketConnections: Map<number, WebSocket> = new Map();

export const connectRoom = (chatRoomId: number): WebSocket => {
  // 이미 연결되어 있고 열려있는 경우 재사용
  const existingSocket = socketConnections.get(chatRoomId);
  if (existingSocket && existingSocket.readyState === WebSocket.OPEN) {
    return existingSocket;
  }

  const wsUrl = `ws://localhost:8080/ws/chat?chatRoomId=${chatRoomId}`;
  console.log('Connecting to WebSocket URL:', wsUrl);

  const ws = new WebSocket(wsUrl);
  console.log('이건가 : ' + ws);
  ws.onopen = () => {
    console.log(`WebSocket 연결(${chatRoomId})이 열렸습니다.`);
  };

  ws.onerror = (error) => {
    console.error(`WebSocket 에러 (${chatRoomId}) :`, error);
  };

  ws.onclose = () => {
    console.log(`WebSocket 연결(${chatRoomId})이 닫혔습니다.`);
    // 연결 종료 시 저장된 연결 제거
    socketConnections.delete(chatRoomId);
  };

  // 새 연결을 Map에 저장
  socketConnections.set(chatRoomId, ws);
  return ws;
};

export const sendMessage = (
  chatRoomId: number,
  webSocketMessage: WebSocketMessage
): void => {
  const ws = socketConnections.get(chatRoomId);
  if (!ws) {
    console.error(`채팅방(${chatRoomId})에 대한 WebSocket 연결이 없습니다.`);
    return;
  }
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(webSocketMessage));
    console.log(`채팅방(${chatRoomId})에 메시지 전송:`, webSocketMessage);
  } else {
    console.error(
      `채팅방(${chatRoomId})의 WebSocket 연결 상태가 OPEN이 아닙니다. (현재 상태: ${ws.readyState})`
    );
  }
};

export const getMessage = (chatRoomId: number): Promise<WebSocketResponse> => {
  return new Promise((resolve, reject) => {
    const ws = socketConnections.get(chatRoomId);
    if (!ws) {
      reject(
        new Error(`채팅방(${chatRoomId})에 대한 WebSocket 연결이 없습니다.`)
      );
      return;
    }

    const messageHandler = (event: MessageEvent) => {
      try {
        const data: WebSocketResponse = JSON.parse(event.data);
        resolve(data);
      } catch (error) {
        reject(error);
      } finally {
        ws.removeEventListener('message', messageHandler);
      }
    };
    ws.addEventListener('message', messageHandler);
  });
};
