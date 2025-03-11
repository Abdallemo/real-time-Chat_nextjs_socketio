FROM node:18-alpine AS base

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .
#RUN npm run build

EXPOSE 3000 8080

CMD [ "npx","concurrently","-n","NEXT,EXPRESS", "-c", "blue,green", "next dev", "node socket-server/server.js" ]