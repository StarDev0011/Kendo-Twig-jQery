/*
 * Copyright © 2022 Anthony Software Group, LLC • All Rights Reserved
 */

const axios = require('axios'),
  config = require('config'),
  logger = require('../controller/logger');
const apiURL = config.get("api.scheme") + '://' +
  config.get("api.host") + '.' +
  config.get("api.domain") + ':' +
  config.get("api.port") +
  config.get("api.path");

logger.debug(`NJCDD API URL: ${apiURL}`);

async function summary() {
  try {
    const result = axios.get(`${apiURL}/summary`);
    logger.info({summary: JSON.stringify(result)});
    return result;
  } catch(error) {
    logger.error(error);
  }
}

module.exports.summary = summary;
