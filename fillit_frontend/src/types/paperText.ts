// 렌더링 설정을 위한 인터페이스
export interface RenderConfig {
  baseSize: number; // 기본 글자 크기
  startY: number; // 시작 Y좌표
  canvasWidth: number; // 캔버스 너비
  canvasHeight: number; // 캔버스 높이
}

// 각 글자의 위치와 크기 정보를 위한 인터페이스
export interface LetterConfig {
  x: number; // 글자의 X좌표
  y: number; // 글자의 Y좌표
  width: number; // 글자의 너비
  height: number; // 글자의 높이
  angle: number; // 글자의 각도
}
