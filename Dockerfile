FROM node:18.8

WORKDIR /usr/src/app
ENV ACES_DOMAIN=aces.local \
    LDAP_ADMIN_PASSWORD=admin \
    LDAP_ADMIN_USERNAME=passworD123 \
    NJCDD_API_PORT=3210 \
    NJCDD_DOMAIN=account.njcdd.org \
    NJCDD_LDAP_PORT=1389 \
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
