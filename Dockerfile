FROM node:22.14.0-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install -g npm@10.9.2
RUN npm install

COPY . .

# .env อยู่ใน root แล้ว React จะอ่านเองตอน build
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
