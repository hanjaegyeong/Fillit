import { WebSocketMessage, WebSocketResponse } from '@/types/websocket';

// 각 사용자별 채팅방의 연결을 저장하기 위한 Map
// 키 형식: `${chatRoomId}_${currentUserPersonalId}`
// 본인이 보낸 메세지인지 확인하는 용도
const socketConnections: Map<string, WebSocket> = new Map();

export const connectRoom = (
  chatRoomId: number,
  currentUserPersonalId: string
): WebSocket => {
  const key = `${chatRoomId}_${currentUserPersonalId}`;

  // 이미 연결되어 있고 열려있는 경우 재사용하기 위함
  const existingSocket = socketConnections.get(key);
  if (existingSocket && existingSocket.readyState === WebSocket.OPEN) {
    return existingSocket;
  }

  const token = localStorage.getItem('accessToken');

  // WebSocket URL에는 chatRoomId만 전달 (백엔드에서는 JWT 토큰 등으로 인증 처리)
  const wsUrl =
    import.meta.env.VITE_WS_URL + `?chatRoomId=${chatRoomId}&jwt=${token}`;
  const ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log(`WebSocket 연결(${chatRoomId})이 OPEN 상태입니다.`);
  };

  ws.onerror = (error) => {
    console.error(`WebSocket 에러 (${chatRoomId}) :`, error);
  };

  ws.onclose = () => {
    console.log(`WebSocket 연결(${chatRoomId})이 닫혔습니다.`);
    socketConnections.delete(key);
  };

  socketConnections.set(key, ws);
  return ws;
};

export const sendMessage = (
  chatRoomId: number,
  currentUserPersonalId: string,
  webSocketMessage: WebSocketMessage
): void => {
  const key = `${chatRoomId}_${currentUserPersonalId}`;
  const ws = socketConnections.get(key);
  if (!ws) {
    console.error(`채팅방(${chatRoomId})에 대한 WebSocket 연결이 없습니다.`);
    return;
  }
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(webSocketMessage));
  } else {
    console.error(
      `채팅방(${chatRoomId})의 WebSocket 연결 상태가 OPEN이 아닙니다. (현재 상태: ${ws.readyState})`
    );
  }
};

export const getMessage = (
  chatRoomId: number,
  currentUserPersonalId: string
): Promise<WebSocketResponse> => {
  return new Promise((resolve, reject) => {
    const key = `${chatRoomId}_${currentUserPersonalId}`;
    const ws = socketConnections.get(key);
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
