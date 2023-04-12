FROM node:latest

WORKDIR /app
COPY ./ ./
RUN npm install --force

ENTRYPOINT npm run start