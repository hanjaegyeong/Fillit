# 베이스 이미지로 OpenJDK 17 사용
FROM openjdk:17-jdk-slim
WORKDIR /app

COPY ./build/libs/*.jar app.jar

ENTRYPOINT ["java","-jar","/app/app.jar"]
