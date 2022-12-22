FROM node:16

WORKDIR /var/www/html

COPY package*.json ./

RUN npm install

EXPOSE 8001

CMD ["npm", "run", "serve", "--", "--port", "80"]