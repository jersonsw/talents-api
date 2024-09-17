FROM node:20.11.0-alpine as dev

RUN apk --update add postgresql-client
RUN apk add --no-cache bash
WORKDIR /app
# Set the Dockerize version as an environment variable
ENV DOCKERIZE_VERSION v0.6.1

# Download, extract and install Dockerize
RUN apk add --no-cache openssl \
    && wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

COPY package*.json ./
COPY ./src ./
COPY src/scripts ./
COPY ./.env ./.env
COPY ./nest-cli.json ./
COPY ./tsconfig*.json ./

RUN npm i -g npm && npm i
