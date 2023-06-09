FROM node:18.8

WORKDIR /opt/njcdd/web
ENV NJCDD_API_PORT=3210 \
    NJCDD_LDAP_PORT=1389 \
    NJCDD_LOGGER_API_PORT=9101 \
    NJCDD_LOGGER_GELF_PORT=11200 \
    NJCDD_LOGGER_SYSLOG_PORT=1514 \
    NJCDD_LOGGER_UI_PORT=9100 \
    NJCDD_MINIO_API_PORT=9000 \
    NJCDD_MINIO_UI_PORT=9001 \
    NJCDD_MONGODB_PORT=27017 \
    NJCDD_REDIS_PORT=6379 \
    NJCDD_WEB_PORT=3200 \
    NODE_ENV=production
EXPOSE 3200

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

COPY . .

CMD [ "node", "./bin/www" ]
