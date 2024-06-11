FROM node:20
LABEL authors="lucao"

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && node dist/main"]
