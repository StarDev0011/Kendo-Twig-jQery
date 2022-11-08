/*
 * Copyright © 2022 Anthony Software Group, LLC • All Rights Reserved
 */

const axios = require('axios'),
  config = require('config');
const apiURL = `${config.get("api.scheme")}://${config.get("api.host")}.${config.get("api.domain")}:${config.get("api.port")}/${config.get("api.path")}`;

async function summary() {
  try {
    const result = axios.get(`${apiURL}/summary`);
    console.log(result);
    return result;
  } catch(error) {
    console.error(error);
  }
}

module.exports.summary = summary;
