import { alphabetImages } from '@/assets/alphabets/alphabets';

// 렌더링 설정을 위한 상수 정의
const RENDER_CONFIG = {
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

// 렌더링 설정을 위한 인터페이스
interface RenderConfig {
  baseSize: number; // 기본 글자 크기
  startY: number; // 시작 Y좌표
  canvasWidth: number; // 캔버스 너비
  canvasHeight: number; // 캔버스 높이
}

// 각 글자의 위치와 크기 정보를 위한 인터페이스
interface LetterConfig {
  x: number; // 글자의 X좌표
  y: number; // 글자의 Y좌표
  width: number; // 글자의 너비
  height: number; // 글자의 높이
  angle: number; // 글자의 각도
}

// 텍스트 길이에 따른 글자 크기 계산
const calculateLetterSize = (textLength: number): number => {
  // 4글자 이하 : 1.3에서 시작해서 글자당 0.1씩 감소
  // 5글자 이상 : 1.2에서 시작해서 글자당 0.1씩 감소
  // 어떤 경우든 최소값 0.8보다 작아질 수 없음
  return textLength <= 4
    ? Math.max(RENDER_CONFIG.SCALE.MIN, 1.3 - textLength * 0.1)
    : Math.max(RENDER_CONFIG.SCALE.MIN, 0.2 - textLength * 0.1);
};

// 텍스트 길이에 따른 글자 간격 계산
const calculateSpacing = (textLength: number): number => {
  if (textLength == 2) return RENDER_CONFIG.SPACING.TWO_LETTERS; // 2글자 : 0.8
  if (textLength >= 3 && textLength <= 4)
    return RENDER_CONFIG.SPACING.THREE_TO_FOUR; // 3~4글자 : 0.6
  return RENDER_CONFIG.SPACING.FIVE_PLUS; // 5글자 이상 : 0.55
};

// 글자 이미지 로드
const loadLetterImage = async (char: string): Promise<HTMLImageElement> => {
  try {
    const img = new Image();
    const lowerChar = char.toLowerCase();

    // 대소문자별 이미지 사용
    img.src =
      char === char.toUpperCase()
        ? alphabetImages[lowerChar].upper
        : alphabetImages[lowerChar].lower;

    // 이미지 로드 완료 대기
    return new Promise((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`이미지 로드 실패: ${char}`));
    });
  } catch (error) {
    console.error('이미지 로드 중 오류:', error);
    throw error;
  }
};

// 각 글자의 위치, 크기, 각도를 계산하는 함수
const calculateLetterConfig = (
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
    ? RENDER_CONFIG.SIZE.FIRST_LETTER // 첫 글자 1.4배
    : index === totalLetters - 1
    ? RENDER_CONFIG.SIZE.LAST_LETTER // 마지막 글자 1.2배
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
    y = config.startY + (isMiddle ? 2 : 0); // 중간 글자만 약간 회전
  } else {
    y = config.startY + (1 - progress * progress) * RENDER_CONFIG.CURVE.HEIGHT; // 2차 함수로 곡선 효과
  }

  // 회전 각도 계산
  const angle = isShortText
    ? index === 0
      ? 0.05 // 첫 글짜 시계방향으로 0.05도
      : index === totalLetters - 1
      ? -0.05 // 마지막 글짜 반시계방향으로 0.05도
      : 0 // 중간 글짜는 회전 없음
    : -progress * RENDER_CONFIG.CURVE.ANGLE; // 5글자 이상일 때 곡선을 따라 회전

  return { x, y, width: letterSize, height: letterSize * ratio, angle };
};

export const getPaperText = async (
  text: string, // 변환할 텍스트
  containerSize: number = 101 // 기본 컨테이너 크기(프로필 사진 크기)
): Promise<string | null> => {
  if (!text) return null; // 텍스트가 없으면 종료

  // 캔버스 생성
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null; // 캔버스 생성 실패 시 종료

  // 캔버스 크기를 더 작게 조정
  canvas.width = containerSize * 2;
  canvas.height = containerSize * 0.8;

  // 선명하게 그리기 위한 설정
  ctx.imageSmoothingEnabled = true; // 이미지 확대/축소 시 부드럽게 표시
  ctx.imageSmoothingQuality = 'high'; // 이미지 품질 향상

  // 기본 렌더링 설정
  const config: RenderConfig = {
    // 기본 글자 크기 계산
    baseSize:
      Math.max(
        RENDER_CONFIG.SIZE.MIN_BASE,
        RENDER_CONFIG.SIZE.BASE_FACTOR * (containerSize / 101)
      ) * calculateLetterSize(text.length),
    startY: canvas.height / 2, // 중앙 정렬을 위해 수정
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
  };

  // 글자 이미지 로드
  try {
    // 최대 8글자까지만 처리
    const letters = await Promise.all(
      text
        .slice(0, 8) // 8글자 제한
        .split('') // 한 글자씩 분리
        .map(loadLetterImage) // 각 글자의 이미지 로드
    );

    const spacing = calculateSpacing(text.length); // 글자 간격 계산
    const centerX = canvas.width / 2; // 중심 X좌표

    // 각 글자 그리기
    letters.forEach((img, i) => {
      // 각 글자의 위치, 크기, 각도 계산
      const letterConfig = calculateLetterConfig(
        img,
        i,
        letters.length,
        config,
        config.baseSize,
        spacing,
        centerX
      );

      // 캔버스에 그리기
      ctx.save(); // 현재 상태 저장
      ctx.translate(letterConfig.x, letterConfig.y); // 글자 위치로 이동
      ctx.rotate(letterConfig.angle); // 글자 회전
      ctx.drawImage(
        img, // 글자 이미지
        -letterConfig.width / 2, // 왼쪽 위치
        -letterConfig.height / 2, // 오른쪽 위치
        letterConfig.width, // 가로 크기
        letterConfig.height // 세로 크기
      );
      ctx.restore(); // 저장했던 상태로 복구
    });
    // 캔버스의 내용을 이미지로 변환
    return canvas.toDataURL();
  } catch (error) {
    console.error('텍스트 생성 실패:', error);
    return null;
  }
};
