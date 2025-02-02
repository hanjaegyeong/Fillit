// 렌더링 설정을 위한 상수 정의
export const PAPER_RENDER_CONFIG = {
  SCALE: {
    MIN: 0.8,
    MAX: 1.3,
  },
  SPACING: {
    TWO_LETTERS: 0.8, // 2글자 일 때 간격
    THREE_TO_FOUR: 0.7, // 3~4글자 일 때 간격
    FIVE_PLUS: 0.65, //5글자 이상일 때 간격
  },
  SIZE: {
    BASE_FACTOR: 40,
    MIN_BASE: 35,
    FIRST_LETTER: 1.6, // 첫 글자 크기 배수
    LAST_LETTER: 1.4, // 마지막 글자 크기 배수
  },
  CURVE: {
    HEIGHT: 14,
    ANGLE: 0.15,
  },
} as const;
