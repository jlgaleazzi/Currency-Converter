FROM node:10

WORKDIR /usr/src/app

RUN npm install

COPY . .

EXPOSE 5555

CMD ["node","server/server.js" ]