# Stage 1: Build React App
FROM node:20 as build

# Đặt thư mục làm việc
WORKDIR /usr/src/app

# Copy package.json và package-lock.json trước để tối ưu cache
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Build ứng dụng
RUN npm run build

# Stage 2: Serve App bằng Nginx
FROM nginx:alpine

# Copy build từ Stage 1 sang Nginx
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expose cổng 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
