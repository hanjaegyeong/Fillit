import { PAPER_RENDER_CONFIG } from '@/constants/paperRenderConfig';
import { RenderConfig, LetterConfig } from '@/types/paperText';

// 텍스트 길이에 따른 글자 크기 계산
export const calculateLetterSize = (textLength: number): number => {
  // 4글자 이하 : 1.3에서 시작해서 글자당 0.1씩 감소
  // 5글자 이상 : 1.2에서 시작해서 글자당 0.1씩 감소
  // 어떤 경우든 최소값 0.8보다 작아질 수 없음
  return textLength <= 4
    ? Math.max(PAPER_RENDER_CONFIG.SCALE.MIN, 1.3 - textLength * 0.1)
    : Math.max(PAPER_RENDER_CONFIG.SCALE.MIN, 0.2 - textLength * 0.1);
};

// 텍스트 길이에 따른 글자 간격 계산
export const calculateSpacing = (textLength: number): number => {
  if (textLength == 2) return PAPER_RENDER_CONFIG.SPACING.TWO_LETTERS; // 2글자 : 0.8
  if (textLength >= 3 && textLength <= 4)
    return PAPER_RENDER_CONFIG.SPACING.THREE_TO_FOUR; // 3~4글자 : 0.6
  return PAPER_RENDER_CONFIG.SPACING.FIVE_PLUS; // 5글자 이상 : 0.55
};

// 각 글자의 위치, 크기, 각도를 계산하는 함수
export const calculateLetterConfig = (
  img: HTMLImageElement, // 로드된 글자 이미지
  index: number, // 현재 글자의 인덱스
  totalLetters: number, // 전체 글자 수
  config: RenderConfig, // 렌더링 설정
  baseSize: number, // 기본 글자 크기
  spacing: number, // 글자 간격
  centerX: number // 중심 X좌표
): LetterConfig => {
  // 각 글자의 위치를 -1~1 사이의 값으로 반환
  const progress = (index / (totalLetters - 1)) * 2 - 1;
  const isShortText = totalLetters <= 4;

  // 글자 크기 배수 계산
  const sizeMultiplier = isShortText
    ? index === 0 // 4글자 이하일 때
      ? 1.5 // 첫 글자 1.5배
      : index === totalLetters - 1
      ? 1.2 // 마지막 글자
      : 0.9 + Math.sin((index / (totalLetters - 1)) * Math.PI) * 0.2 // 중간 글자는 sin함수로 크기 변화
    : index === 0 // 5글자 이상일 때
    ? PAPER_RENDER_CONFIG.SIZE.FIRST_LETTER // 첫 글자 1.4배
    : index === totalLetters - 1
    ? PAPER_RENDER_CONFIG.SIZE.LAST_LETTER // 마지막 글자 1.2배
    : 0.8 + Math.sin((index / (totalLetters - 1)) * Math.PI * 0.2);

  // 최종 글자 크기
  const letterSize = baseSize * sizeMultiplier;
  // 이미지 비율
  const ratio = img.height / img.width;

  // x좌표 계산
  const totalWidth = totalLetters * baseSize * spacing; // 전체 텍스트 너비
  const startX = centerX - totalWidth / 2; // 왼쪽 시작 지점
  const x = startX + index * baseSize * spacing;

  // y좌표 계싼(곡선 효과)
  let y;
  if (isShortText) {
    const isMiddle = index > 0 && index < totalLetters - 1;
    y = config.startY + (isMiddle ? 2 : 0); // 중간 글자만 약간 내림
  } else {
    y =
      config.startY +
      (1 - progress * progress) * PAPER_RENDER_CONFIG.CURVE.HEIGHT; // 2차 함수로 곡선 효과
  }

  // 회전 각도 계산
  const angle = isShortText
    ? index === 0
      ? 0.05 // 첫 글짜 시계방향으로 0.05도
      : index === totalLetters - 1
      ? -0.05 // 마지막 글짜 반시계방향으로 0.05도
      : 0 // 중간 글짜는 회전 없음
    : -progress * PAPER_RENDER_CONFIG.CURVE.ANGLE; // 5글자 이상일 때 곡선을 따라 회전

  return { x, y, width: letterSize, height: letterSize * ratio, angle };
};
