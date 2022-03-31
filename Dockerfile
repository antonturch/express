FROM node

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . .

ENV PORT 5000

EXPOSE $PORT

CMD ["nodemon", "src/index.ts"]