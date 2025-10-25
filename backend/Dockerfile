FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install ALL dependencies (including dev dependencies needed for build)
RUN npm install

COPY . .

EXPOSE 3001

CMD ["node", "src/app.js"]
