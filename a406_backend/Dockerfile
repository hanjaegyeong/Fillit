# 베이스 이미지로 OpenJDK 17 사용
FROM openjdk:17-jdk-slim
WORKDIR /app

# build/libs 안의 JAR 한 개를 app.jar로
COPY build/libs/*.jar app.jar

ENTRYPOINT ["java","-jar","/app/app.jar"]
