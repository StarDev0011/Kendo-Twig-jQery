/*
 * Copyright © 2022 Anthony Software Group, LLC • All Rights Reserved
 */

const logger = require('./logger');
const config = require("config"),
  url = config.get("redis.scheme") + '://:' +
    config.get("redis.password") + '@' +
    config.get("redis.host") + '.' +
    config.get("redis.domain") + ':' +
    config.get("redis.port") + '/' +
    config.get("redis.db");

logger.debug(`Redis URL: ${url}`);

module.exports.url = url;
