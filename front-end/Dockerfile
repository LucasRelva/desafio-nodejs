FROM node:20 as BUILD_IMAGE
LABEL authors="lucao"

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080
CMD ["npm", "run", "preview"]