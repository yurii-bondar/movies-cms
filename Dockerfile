FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci
RUN npx modclean -r

COPY . .

RUN npm run build

EXPOSE 8000

CMD ["node", "dist/src/index.js"]
