# Stage 1: Build Vite App
FROM harbor-private.aeonth.com/container-images/library/node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm config set strict-ssl false
RUN npm install --registry=https://sonatype.aeonth.com/repository/npm-proxy/
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx on port 8080
FROM nginx:alpine

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Use custom nginx config to listen on 8080
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
