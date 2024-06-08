FROM node:20
LABEL authors="lucao"

ENV NODE_ENV dev
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
RUN npx primsa generate
RUN npx prisma migrate deploy

CMD [ "node", "dist/main" ]