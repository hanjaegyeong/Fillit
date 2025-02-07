# 1. Node.js 22 Alpine 기반 이미지 사용
FROM node:22-alpine

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. npm 캐시 디렉토리 설정
RUN mkdir -p /home/node/.npm
ENV NPM_CONFIG_CACHE=/home/node/.npm

# 4. 빌드에 필요한 패키지 추가 (Alpine에서 필요)
RUN apk add --no-cache python3 make g++

# 5. package.json, package-lock.json 복사 후 의존성 설치
COPY package*.json ./
RUN npm install --production

# 6. 빌드된 파일 복사 (Jenkins에서 빌드된 `dist/` 폴더가 존재해야 함)
COPY dist /app/dist

# 7. `serve` 패키지 설치 (빌드된 정적 파일 제공)
RUN npm install -g serve

# 8. 컨테이너 내부에서 사용할 포트 정의
EXPOSE 3000

# 9. 컨테이너 실행 시 정적 파일 제공 (3000번 포트에서 실행)
CMD ["serve", "-s", "build", "-l", "3000"]
