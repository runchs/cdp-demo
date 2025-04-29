# Stage 1: Build stage
FROM node:16-alpine AS builder

# กำหนด directory ในการทำงานภายใน container
WORKDIR /app

# กำหนด ARG สำหรับการเลือก ENV ไฟล์ที่ต้องการ (เช่น sit, prod)
ARG ENV_FILE=.env.sit
ARG BUILD_MODE=sit

# คัดลอกไฟล์ package.json และ package-lock.json สำหรับจัดการ dependencies
COPY package.json package-lock.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์ที่เลือกมา (ตาม ENV_FILE) จาก config ลงใน root ของ container
COPY config/${ENV_FILE} .env

# คัดลอกโปรเจ็กต์ทั้งหมดลงใน container
COPY . .

# รันคำสั่ง build สำหรับ SIT หรือ Production (ตาม mode ที่เลือก)
RUN npm run build:${BUILD_MODE}

# Stage 2: Run stage
FROM nginx:alpine

# กำหนด directory ในการทำงานภายใน container
WORKDIR /usr/share/nginx/html

# ลบหน้า index พื้นฐานของ nginx ออก
RUN rm -rf ./*

# คัดลอก build จาก stage แรกไปยัง directory ของ nginx
COPY --from=builder /app/dist ./

# คัดลอกไฟล์ certificate สำหรับ SIT
COPY certs/CA-sit.cer /etc/ssl/certs/CA-sit.cer

# คัดลอก config folder สำหรับ SIT
COPY config/ /usr/share/nginx/html/config/

# เปิดพอร์ต 80 สำหรับแอป
EXPOSE 80

# คำสั่งเพื่อให้ nginx ทำงาน
CMD ["nginx", "-g", "daemon off;"]
