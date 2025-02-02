import { alphabetImages } from '@/assets/alphabets/alphabets';
import { RenderConfig } from '@/types/paperText';
import { PAPER_RENDER_CONFIG } from '@/constants/paperRenderConfig';
import {
  calculateLetterSize,
  calculateSpacing,
  calculateLetterConfig,
} from './getPaperCacluations';

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
        PAPER_RENDER_CONFIG.SIZE.MIN_BASE,
        PAPER_RENDER_CONFIG.SIZE.BASE_FACTOR * (containerSize / 101)
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
