FROM node:4.2

EXPOSE 8000

WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install

CMD ["node", "server.js"]
