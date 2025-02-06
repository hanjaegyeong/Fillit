# Node.js 22 Alpine 기반 이미지를 사용합니다.
FROM node:22-alpine

# 작업 디렉토리를 설정합니다.
WORKDIR /app

# 정적 파일을 서비스할 수 있도록 serve 패키지를 전역 설치합니다.
RUN npm install -g serve

# Jenkins 파이프라인에서 생성된 build 폴더를 컨테이너 내로 복사합니다.
COPY build /app/build

# 컨테이너에서 사용할 포트를 노출합니다.
# (예시에서는 3000번 포트를 사용합니다. 필요에 따라 변경하세요.)
EXPOSE 3000

# 컨테이너 실행 시 serve를 통해 build 폴더를 정적 파일로 서비스합니다.
# -s : Single-Page Application 모드 (SPA)로 동작하게 함.
# -l 3000 : 3000 포트에서 실행.
CMD ["serve", "-s", "build", "-l", "3000"]
