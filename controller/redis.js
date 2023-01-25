/*
 * Copyright © 2023 Anthony Software Group, LLC • All Rights Reserved
 */

const logger = require('./logger');
const config = require("config");
const url = `redis://:${config.get("admin.password")}@redis/1`;

logger.debug(`Redis URL: ${url}`);

module.exports.url = url;
