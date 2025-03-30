FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --build-from-source && npm rebuild bcrypt --build-from-source

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
