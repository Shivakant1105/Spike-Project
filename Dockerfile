#FROM node:16-alpine AS build
FROM node:16.16-bullseye AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . /app
ARG configuration=production
RUN npm run build -- --output-path=./dist/spike-project/ --configuration $configuration
 

FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/spike-project /usr/share/nginx/html
EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]

CMD ["/bin/sh","-c","exec nginx -g 'daemon off;'"]

