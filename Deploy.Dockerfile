FROM node:lts-alpine as build-stage

WORKDIR /var/www/html

COPY package*.json ./

RUN npm install

COPY . .

ARG ENV

RUN npm run ${ENV}

FROM nginx:stable-alpine as deployment-stage

COPY --from=build-stage /var/www/html/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]