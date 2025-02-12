export const connectRoom = (chatRoomId: number): WebSocket => {
  const wsUrl = `ws://localhost:8080/ws/chat?chatRoomId=${chatRoomId}`;
  const ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log('WebSocket 연결이 열렸습니다.');
  };

  ws.onerror = (error) => {
    console.error('WebSocket 에러:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket 연결이 닫혔습니다.');
  };

  return ws;
};
