FROM node:14.17-alpine

WORKDIR "/var/www/html"

COPY package*.json ./

RUN npm install

EXPOSE 8080

CMD ["npm", "run", "serve"]