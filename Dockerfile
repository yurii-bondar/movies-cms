FROM node:22-alpine

ENV NODE_ENV=prod

WORKDIR /app

COPY package*.json ./

RUN npm ci
RUN npx modclean -r

COPY . .

RUN npm run build

EXPOSE 8000

CMD ["node", "-r", "dotenv/config", "dist/src/index.js"]
