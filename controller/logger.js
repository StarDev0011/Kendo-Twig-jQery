/*
 * Copyright © 2022 Anthony Software Group, LLC • All Rights Reserved
 */

const config = require('config'),
  winston = require('winston');

const logger = winston.createLogger(
  {
    level: config.get('app.log.level'),
    format: winston.format.json(),
    defaultMeta: {service: config.get('app.name')},
    transports: [
      new winston.transports.File({filename: config.get('app.log.filename.error'), level: 'error'}),
      new winston.transports.File({filename: config.get('app.log.filename.combined'), level: 'debug'}),
      new winston.transports.Console({format: winston.format.simple(), level: 'debug'})
    ]
  });

module.exports = logger;
