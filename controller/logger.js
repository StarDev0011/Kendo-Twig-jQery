/*
 * Copyright © 2022 Anthony Software Group, LLC • All Rights Reserved
 */

const config = require('config'),
  winston = require('winston');

const logger = winston.createLogger(
  {
    level: config.get('web.log.level'),
    format: winston.format.json(),
    defaultMeta: {service: config.get('web.name')},
    transports: [
      new winston.transports.File({filename: config.get('web.log.filename.error'), level: 'error'}),
      new winston.transports.File({filename: config.get('web.log.filename.combined'), level: 'debug'}),
      new winston.transports.Console({format: winston.format.simple(), level: 'debug'})
    ]
  });

logger.debug({message: `Logging at level '${logger.level}'`});

module.exports = logger;
