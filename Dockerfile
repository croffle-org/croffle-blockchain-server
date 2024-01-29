FROM node:21.4.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV MYSQL_HOST=host.docker.internal

EXPOSE 8080

RUN npm install --global pm2

ARG ENVIRONMENT

CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "${ENVIRONMENT}"]
