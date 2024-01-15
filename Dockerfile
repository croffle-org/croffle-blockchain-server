FROM node:21.4.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV MYSQL_HOST=host.docker.internal

EXPOSE 8080

CMD ["npm", "run", "start:dev-dist"]

# docker build -t croffle .
# docker run -d -p 8080:8080 croffle