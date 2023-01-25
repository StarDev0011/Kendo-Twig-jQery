/*
 * Copyright © 2023 Anthony Software Group, LLC • All Rights Reserved
 */

const axios = require('axios'),
  config = require('config'),
  logger = require('../controller/logger');
const apiURL = `http://njcdd-api:${config.get("api.port")}/${config.get("api.path")}`;

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
