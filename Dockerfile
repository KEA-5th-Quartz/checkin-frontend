# Node.js 이미지를 사용하여 빌드 단계 수행
FROM node:22 as build-stage

# 작업 디렉토리 설정
WORKDIR /app

# package.json 파일 복사 및 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사 및 빌드
COPY . .
RUN npm run build

# Nginx 이미지를 사용하여 배포 단계 수행
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]