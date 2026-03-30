FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3355

CMD ["npx", "ts-node", "src/server.ts"]