FROM node:22-alpine

WORKDIR /app

# npm 캐시 설정
RUN mkdir -p /home/node/.npm
ENV NPM_CONFIG_CACHE=/home/node/.npm

COPY package*.json ./
RUN npm install --unsafe-perm

COPY build /app/build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
