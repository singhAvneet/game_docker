FROM node:latest

ENV NODE_ENV=development

COPY . /var/www
WORKDIR /var/www

RUN npm install gulp-cli -g
RUN npm install -g gulp

RUN npm install --quiet
EXPOSE 3000
ENTRYPOINT ["/var/www/entrypoint.sh"]