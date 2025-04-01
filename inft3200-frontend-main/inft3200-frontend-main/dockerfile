FROM node:18-alpine AS base

RUN mkdir -p /frontend/app

WORKDIR /frontend/app

COPY package*.json ./
RUN npm install

RUN mkdir -p ./src
RUN mkdir -p ./public
RUN mkdir -p ./node_modules
RUN mkdir -p ./.next

COPY *.json ./
COPY *.ts ./
COPY *.js ./
COPY public ./public
COPY src ./src
COPY *.env ./

RUN npm run build

EXPOSE 3000

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
CMD npm run start
