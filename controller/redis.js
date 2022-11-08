/*
 * Copyright © 2022 Anthony Software Group, LLC • All Rights Reserved
 */

const config = require("config");
const url = `redis://:${config.get("app.password")}@${config.get("redis.host")}.${config.get("app.domain")}:${config.get("redis.port")}/0`;

module.exports.url = url;
