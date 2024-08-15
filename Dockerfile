FROM node:18-bookworm-slim

RUN mkdir /app \
  && chown -R node:node /app \
  && apt-get update \
  && apt-get install -y nano bash-completion

ENV NPM_VERSION=9.6.7

RUN npm install -g "npm@^${NPM_VERSION}" 

COPY ./ /app/

WORKDIR /app

RUN npm install
