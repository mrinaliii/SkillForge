# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy ALL source files including vite.config.ts
COPY . .

RUN npm run build

# Production stage
FROM nginx:alpine

# Vite creates 'dist' directory, not 'build'
COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
